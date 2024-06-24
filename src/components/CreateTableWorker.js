import { SaveOutlined, PlusCircleOutlined, MinusCircleOutlined, CloseCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"
import { Table, Form, Input, InputNumber, Checkbox } from "antd"
import React, { useContext, useEffect, useRef, useState } from "react"
import { guid } from "../utils/guid"
import MenuBar from "./MenuBar"

function CreateTableWorker() {

    const [dataSource, setDataSource] = useState([
        { key: guid(), name: 'id', dataType: 'string', length: '48', allowNull: false, primaryKey: false }
    ])

    const menuItems = [
        { id: guid(), label: '保存', icon: <SaveOutlined />, click: () => { alert('bingo')}},
        { id: guid(), label: '添加字段', icon: <PlusCircleOutlined />, click: () => { 
            setDataSource([...dataSource, 
                { key: guid(), name: '', dataType: '', length: 0, allowNull: false, primaryKey: false}
            ])
        }},
        { id: guid(), label: '插入字段', icon: <MinusCircleOutlined />, click: () => { alert('bingo')}},
        { id: guid(), label: '删除字段', icon: <CloseCircleOutlined />, click: () => { alert('bingo')}},
        { id: guid(), label: '上移', icon: <ArrowUpOutlined />, click: () => { alert('bingo')}},
        { id: guid(), label: '下移', icon: <ArrowDownOutlined />, click: () => { alert('bingo')}}
    ]

    const defaultColumns = [
        { title: '字段名', dataIndex: 'name', inputType: 'text' , width: '20%', editable: true },
        { title: '类型', dataIndex: 'dataType', inputType: 'text', width: '20%', editable: true },
        { title: '长度', dataIndex: 'length',inputType: 'number', width: '20%', editable: true },
        { title: '允许NULL', dataIndex: 'allowNull', inputType: 'bool', width: '20%',  editable: true },
        { title: '是否主键', dataIndex: 'primaryKey', inputType: 'bool', editable: true },
        { title: '操作', dataIndex: 'operation' }
    ]
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.inputType,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
            })
        }
    })
    const EditableContext = React.createContext(null)
    const EditableRow = ({index, ...props}) => {
        const [form] = Form.useForm()
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value = {form}>
                    <tr {...props}/>
                </EditableContext.Provider>
            </Form>
        )
    }
    const EditableCell = ({title, editable, inputType, children, dataIndex, record, handleSave, ...restProps}) => {
        const inputRef = useRef(null)
        const [editing, setEditing] = useState(false)
        const form = useContext(EditableContext)
        useEffect(() => {
            if (editing) {
                inputRef.current.focus()
            }
        }, [editing])
        const toggleEdit = () => {
            setEditing(!editing)
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            })
        }
        const inputNode = () => {
            switch (inputType) {
                case 'text':
                    return (<Input ref={inputRef} />)
                case 'number':
                    return (<InputNumber ref={inputRef} />)
                case 'bool':
                    return (<Checkbox ref={inputRef} />)
                default:
                    return (<Input ref={inputRef} />)
            }
        }
        let childNode = children
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    name={dataIndex}
                    rules = {[{required: true, message: `${title} 需要填写`}]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                <div className="editable-cell-value-wrap"
                    style={{ paddingRight: 24}}
                    onClick = {toggleEdit}
                >
                    {children}
                </div>
            )
        }
        return <td {...restProps}>{childNode}</td>
    }
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    }
    return (
        <div>
            <MenuBar menuItems={menuItems}/>
            <Table 
                columns={columns} 
                components={components}
                dataSource = {dataSource}
                bordered 
                size="small" 
                rowClassName={() => 'editable-row'} 
                style={{ marginTop: '10px' }} 
            />
        </div>
    )
}

export default CreateTableWorker
