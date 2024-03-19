import { useEffect, useRef, useState } from 'react'
import { Controlled as CodeMirror} from 'react-codemirror2';
import { Toast } from 'primereact/toast';
import { guid } from '../utils/guid';
import { Tabs } from 'antd';
import Loading from 'react-loading'
import MenuBar from './MenuBar';
import { PlayCircleOutlined, SaveOutlined } from '@ant-design/icons'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/sql/sql'
import '@codemirror/lang-json'
import '@codemirror/lang-sql'
import '@codemirror/lint'
import 'codemirror/addon/display/autorefresh'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter' 
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/foldgutter.css'

const ipcRenderer = window.ipcRender

function QueryWork({worker, updateWorker}) {
    const toast = useRef(null)
    const sqlRef = useRef(null)
    const [isSelected, setIsSelected] = useState(false)
    const [selectedSql, setSelectedSql] = useState('')
    const [activeKey, setActiveKey] = useState(0)
    const menuItems = [
        { id: guid(), label: '保存', icon: <SaveOutlined />, click: () => { alert('bingo')}},
        { id: guid(), label: isSelected ? '运行选中内容' : '运行', icon: <PlayCircleOutlined />, click: () => { execSql() }}
    ]
    const execSql = () => {
        worker.tabs.splice(1, worker.tabs.length)
        worker.data = []
        if (window.conn && window.conn.connected) {
            if (worker.sql === '') {
                toast.current.show(
                    { severity: 'error', summary: 'Info', detail: '请先输入查询语句' }
                )
                return
            }
            worker.isLoading = true
            updateWorker(worker)
            if (isSelected) {
                worker.sqlArry = selectedSql.split(/;[\n]?/)
                ipcRenderer.invoke('execSql', {
                    ...worker,
                    sql: selectedSql,
                    conn: window.conn
                })
            }
            else {
                worker.sqlArry = worker.sql.split(/;[\n]?/)
                ipcRenderer.invoke('execSql', {
                    ...worker,
                    conn: window.conn
                })
            }
        } else {
            toast.current.show(
                { severity: 'error', summary: 'Info', detail: '请先连接数据库' }
            )
        }
    }
    
    /* Trigger when sql editor change. */
    const onSqlChange = (editor, data, value) => {
        worker.sql = value
        updateWorker(worker)
    }

    /* Trigger when sql editor selection change. */
    const onSelection = (editor, data) => {
        /* Make sure after react view render, then get selection text. */
        window.requestAnimationFrame(() => {
            const selectText = editor.doc.getSelection()
            if (selectText) {
                setIsSelected(true)
                setSelectedSql(selectText)
            } else {
                setIsSelected(false)
            }
        })
    }

    /* Handler response data. */
    const handleResp = (body) => {
        if (body === '')
            return
        try {
            const jsonBody = JSON.parse(body)
            if (Array.isArray(jsonBody)) {
                let msg = ''
                for (let i = 0, j = 1; i < jsonBody.length; i++) {
                    const item = jsonBody[i]
                    msg = msg.concat(worker.sqlArry[i] + '\n',
                        '结果: ' + (item.success ? 'OK' : 'ERROR') + '\n', 
                        '信息: ' + item.message + '\n',
                        '用时: ' + item.duration + 's\n',
                        (item.rows || jsonBody.rows === 0 ? '行数: ' + item.rows : '') + '\n\n')
                    if (item.success && item.data) {
                        worker.data.push(JSON.stringify(item.data, null, '\t'))
                        worker.tabs.push({
                            key: j,
                            label: `数据 ${j++}`
                        })
                    }
                }
                worker.message = msg
            } else {
                if (jsonBody.success && jsonBody.data) {
                    worker.data.push(JSON.stringify(jsonBody.data, null, '\t'))
                    worker.tabs.push({
                        key: 1,
                        label: '数据1'
                    })
                }
                const msg = '结果: ' + (jsonBody.success ? 'OK' : 'ERROR') + '\n' +
                            '信息: ' + jsonBody.message + '\n' +
                            '用时: ' + jsonBody.duration + 's\n' + 
                            (jsonBody.rows || jsonBody.rows === 0 ? '行数: ' + jsonBody.rows : '') 
                worker.message = msg
            }
        } catch (err) {
            worker.message = err
        }
        setActiveKey(worker.tabs.length - 1)
    }
    useEffect(() => {
        if (sqlRef.current) {
            sqlRef.current.editor.focus()
        }
    }, [worker])

    useEffect(() => {
        const listener = (event, message) => {
            if (worker.isLoading) {
                handleResp(message)
                worker.isLoading = false
            }
            updateWorker(worker)
        }
        ipcRenderer.receive(`${worker.key}_data`, listener)
        return () => { ipcRenderer.off(`${worker.key}_data`, listener)}
    }, [])

    useEffect(() => {
        if (worker.trigger) {
            worker.trigger = false
            execSql()
        }
    }, [worker])

    return (
        <>
            <MenuBar menuItems={menuItems}/> 
            <div className="sql-space">
                <CodeMirror
                    className="sql-input"
                    ref={sqlRef}
                    value={worker.sql}
                    options={{
                        mode: 'text/x-sql',
                        theme: 'default',
                        lineNumbers: true,
                        tabSize: 4,
                        autoCloseBrackets: false,
                        autoRefresh: false,
                        lineWrapping: true
                    }}
                    onBeforeChange={onSqlChange}
                    onSelection={onSelection}
                />
            </div>
            { worker.isLoading && window.conn.connected && (<div className='loading-json-space'><Loading type="bars" color="#00BFFF" height={80} width={80} /></div>)}
            { (!worker.isLoading || !window.conn.connected) && (
                <div className='result-space'>
                    <Tabs 
                        activeKey={activeKey}
                        items={worker.tabs}
                        type="card"
                        onChange={setActiveKey}
                    />
                    {   activeKey === 0 && (
                        <div className='message-space'>
                            <textarea value={worker.message} readOnly className='message-input'/>
                        </div>)
                    }
                    {
                        worker.data.map((data, index) => {
                            return activeKey === (index + 1) && (
                            <CodeMirror
                                key={index}
                                className='json-space'
                                value={data}
                                options={{
                                    lineNumbers: true,
                                    mode: {name : 'application/json', json: true, statementIndent: 2},
                                    theme: 'default',
                                    gutters: ['CodeMirror-foldgutter', 'CodeMirror-linenumbers', 'CodeMirror-lint-markers'],
                                    lint: true,
                                    lineWrapping: false,
                                    identWithTabs: false,
                                    autoCloseTags: true,
                                    autoCloseBrackets: true,
                                    matchBrackets: true,
                                    matchTags: true,
                                    tabSize: 2,
                                    readOnly: true
                                }}
                            />)
                        })
                    }
                </div>
            )}
            <Toast ref={toast} />
        </>
    )
}

export default QueryWork
