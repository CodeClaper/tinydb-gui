import { useState, useEffect, useRef } from 'react'
import { Controlled as CodeMirror} from 'react-codemirror2';
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast';
import Loading from 'react-loading'

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
    const execSql = () => {
        if (window.conn && window.conn.connected) {
            if (worker.sql === '') {
                toast.current.show(
                    { severity: 'error', summary: 'Info', detail: '请先输入查询语句' }
                )
                return
            }
            worker.isLoading = true
            updateWorker(worker)
            ipcRenderer.invoke('execSql', {
                ...worker,
                conn: window.conn
            })
        } else {
            toast.current.show(
                { severity: 'error', summary: 'Info', detail: '请先连接数据库' }
            )
        }
    }

    const onSqlChange = (editor, data, value) => {
        worker.sql = value
        updateWorker(worker)
    }
    const handleResp = (body) => {
        if (body === '')
            return
        try {
            const jsonBody = JSON.parse(body)
            if (jsonBody.success)
                worker.data = JSON.stringify(jsonBody.data, null, '\t')
            else
                worker.data = '{}'
            const msg = '结果: ' + (jsonBody.success ? 'OK' : 'ERROR') + '\n' +
                        '信息: ' + jsonBody.message + '\n' +
                        '用时: ' + jsonBody.duration + 's\n' + 
                        (jsonBody.rows ? '行数: ' + jsonBody.rows : '') 
            worker.message = msg
        } catch (err) {
            worker.message = err
        }
    }
    useEffect(() => {
        if (sqlRef.current) {
            sqlRef.current.editor.focus()
        }
    }, [worker])

    ipcRenderer.receive(`${worker.key}_data`, (event, message) => {
        handleResp(message)
        worker.isLoading = false
        updateWorker(worker)
    })
    useEffect(() => {
        if (worker.trigger) {
            worker.trigger = false
            execSql()
        }
    }, [worker])
    return (
        <>
            <div className="sql-space">
                <CodeMirror
                    className="sql-input"
                    ref={sqlRef}
                    value={worker.sql}
                    options={{
                        mode: 'text/x-sql',
                        theme: 'default',
                        tabSize: 4,
                        autoCloseBrackets: false,
                        autoRefresh: false,
                        lineWrapping: true
                    }}
                    onBeforeChange={onSqlChange}
                />
                <Button label="执行" onClick={ execSql } size="small" style={{ marginLeft: '10px'}}/>
            </div>
            { worker.isLoading && window.conn.connected && (<div className='loading-json-space'><Loading type="bars" color="#00BFFF" height={80} width={80} /></div>)}
            { (!worker.isLoading || !window.conn.connected) && (
                <CodeMirror
                    className='json-space'
                    value={worker.data}
                    options={{
                        lineNumbers: true,
                        mode: { name : 'application/json', json: true, statementIndent: 2},
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
                />
            )}
            { worker.isLoading && (<div className='loading-message-space'><Loading type="bars" color="#00BFFF" height={80} width={80} /></div>)}
            { !worker.isLoading && (
                <div className='message-space'>
                    <textarea value={worker.message} readOnly className='message-input'/>
                </div>
            )}
            <Toast ref={toast} />
        </>
    )
}

export default QueryWork
