import "./AssetTable.css";

function AssetTable({ assets = [] }) {
    const format = (value) =>
        value == null || value === ""
            ? "—"
            : `${Number(value).toFixed(1)}%`;

    return (
        <div className="table-wrapper">
            <table className="asset-table">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Type</th>
                        <th>IP Address</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Risk</th>
                        <th>CPU</th>
                        <th>Memory</th>
                        <th>Disk</th>
                        <th>Network</th>
                    </tr>
                </thead>

                <tbody>
                    {assets.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="empty-state">
                                No assets found.
                            </td>
                        </tr>
                    ) : (
                        assets.map((asset) => (
                            <tr key={asset.id}>
                                <td>
                                    <strong className="asset-name">
                                        {asset.assetName}
                                    </strong>
                                </td>

                                <td>{asset.assetType || "—"}</td>

                                <td className="ip-address">
                                    {asset.ipAddress || "—"}
                                </td>

                                <td>{asset.location || "—"}</td>

                                <td>
                                    <Badge value={asset.status} />
                                </td>

                                <td>
                                    <Badge
                                        value={asset.risk || "LOW"}
                                        risk
                                    />
                                </td>

                                <td>{format(asset.cpuUsage)}</td>
                                <td>{format(asset.memoryUsage)}</td>
                                <td>{format(asset.diskUsage)}</td>
                                <td>{format(asset.networkUsage)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Badge({ value, risk = false }) {
    const text = value || "UNKNOWN";

    return (
        <span
            className={`table-badge ${text.toLowerCase()} ${
                risk ? "risk-badge" : ""
            }`}
        >
            {text}
        </span>
    );
}

export default AssetTable;