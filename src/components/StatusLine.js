
function StatusLine({connected}) {
    return (
        <div className="status-line">
            {connected ? 'Connected' : 'Disconnected'}
        </div>
    )
}

export default StatusLine
