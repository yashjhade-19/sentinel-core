function AssetTable({ assets }) {
    return (
        <div className="table-wrapper">
            <table className="asset-table">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>IP Address</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>CPU</th>
                        <th>Memory</th>
                        <th>Network</th>
                    </tr>
                </thead>

                <tbody>

                    {assets.length === 0 ? (

                        <tr>
                            <td colSpan="8" className="empty-state">
                                No assets found
                            </td>
                        </tr>

                    ) : (

                        assets.map((asset) => (

                            <tr key={asset.id}>

                                <td className="asset-name">
                                    {asset.assetName}
                                </td>

                                <td>
                                    {asset.assetType}
                                </td>

                                <td className="ip-address">
                                    {asset.ipAddress}
                                </td>

                                <td>
                                    {asset.location}
                                </td>

                                <td>
                                    <span
                                        className={`status-badge ${asset.status?.toLowerCase()}`}
                                    >
                                        {asset.status}
                                    </span>
                                </td>

                                <td>
                                    {asset.cpuUsage}%
                                </td>

                                <td>
                                    {asset.memoryUsage}%
                                </td>

                                <td>
                                    {asset.networkUsage}%
                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>
        </div>
    );
}

export default AssetTable;