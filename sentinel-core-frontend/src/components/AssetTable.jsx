const assets = [
  {
    id: 1,
    assetName: "Server-01",
    assetType: "Linux Server",
    ipAddress: "192.168.1.10",
    location: "Indore",
    status: "Active",
    cpuUsage: 42.5,
    memoryUsage: 58.2,
    networkUsage: 24.8,
  },
  {
    id: 2,
    assetName: "Server-02",
    assetType: "Windows Server",
    ipAddress: "192.168.1.11",
    location: "Mumbai",
    status: "Active",
    cpuUsage: 35.0,
    memoryUsage: 49.5,
    networkUsage: 18.3,
  },
];

function AssetTable() {
  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>IP Address</th>
          <th>Location</th>
          <th>Status</th>
          <th>CPU (%)</th>
          <th>Memory (%)</th>
          <th>Network (%)</th>
        </tr>
      </thead>

      <tbody>
        {assets.map((asset) => (
          <tr key={asset.id}>
            <td>{asset.assetName}</td>
            <td>{asset.assetType}</td>
            <td>{asset.ipAddress}</td>
            <td>{asset.location}</td>
            <td>{asset.status}</td>
            <td>{asset.cpuUsage}</td>
            <td>{asset.memoryUsage}</td>
            <td>{asset.networkUsage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AssetTable;