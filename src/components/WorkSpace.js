import { useState, useEffect, useRef } from 'react'
import { Controlled as CodeMirror} from 'react-codemirror2';
import { Button } from 'primereact/button'
import { TabView, TabPanel } from 'primereact/tabview'
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
const  ipcRenderer = window.ipcRender

function WorkSpace() {
    const [sql, setSql] = useState('')
    const [json, setJson] = useState('{}')
    const [message, setMessage] = useState('')
    const sqlRef = useRef(null)
    const execSql = () => {
        ipcRenderer.invoke('execSql', sql)
    }
    useEffect(() => {
        ipcRenderer.receive('data', (event, message) => {
            handleResp(message)
        })
        if (sqlRef.current) {
            sqlRef.current.editor.focus()
        }
    }, [])
    const onJsonChange = (editor, data, value) => {
        setJson(value)
    }
    const onSqlChnage = (editor, data, value) => {
        setSql(value)
    }
    const handleResp = (body) => {
        if (body === '')
            return
        try {
            const jsonBody = JSON.parse(body)
            if (jsonBody.success)
                setJson(JSON.stringify(jsonBody.data, null, '\t'))
            else
                setJson('{}')
            const msg = '结果: ' + (jsonBody.success ? 'OK' : 'ERROR') + '\n' +
                        '信息: ' + jsonBody.message + '\n' +
                        '用时: ' + jsonBody.duration + 's\n' + 
                        (jsonBody.rows ? '行数: ' + jsonBody.rows : '') 
            setMessage(msg)
        } catch (err) {

        }
    }
    return (
        <div className="work-space">
            <div className="sql-space">
                <CodeMirror
                    className="sql-input"
                    ref={sqlRef}
                    value={sql}
                    options={{
                        mode: 'text/x-sql',
                        theme: 'default',
                        tabSize: 4,
                        autoCloseBrackets: false,
                        autoRefresh: false,
                        lineWrapping: true
                    }}
                    onBeforeChange={onSqlChnage}
                />
                <Button label="执行" onClick={ execSql } size="small" style={{ marginLeft: '10px'}}/>
            </div>
            <CodeMirror
                className='json-space'
                value={json}
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
                onBeforeChange={ onchange }
            />
            <div className='message-space'>
                <textarea value={message} readOnly className='message-input'/>
            </div>
        </div>
    )
}

export default WorkSpace


