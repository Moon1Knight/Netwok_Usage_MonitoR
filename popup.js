// document.addEventListener('DOMContentLoaded', () => {
//     chrome.runtime.sendMessage({ type: 'getNetworkData' }, response => {
//       document.getElementById('dataUsage').textContent = `Data Usage: ${response.dataUsage} bytes`;
//       document.getElementById('speed').textContent = `Speed: ${response.speed.toFixed(2)} bytes/sec`;
//     });
  
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(position => {
//         const { latitude, longitude } = position.coords;
//         document.getElementById('location').textContent = `Location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
//       }, error => {
//         document.getElementById('location').textContent = `Location: Error (${error.message})`;
//       });
//     } else {
//       document.getElementById('location').textContent = 'Location: Geolocation not supported';
//     }
  
//     fetch('https://api.ipify.org?format=json')
//       .then(response => response.json())
//       .then(data => {
//         document.getElementById('ip').textContent = `IP Address: ${data.ip}`;
//       })
//       .catch(error => {
//         document.getElementById('ip').textContent = `IP Address: Error (${error.message})`;
//       });
//   });
  
document.addEventListener('DOMContentLoaded', () => {
  const convertBytes = (bytes) => {
    const MB = bytes / (1024 * 1024);
    const GB = MB / 1000;
    if (GB >= 1) {
      return `${GB.toFixed(2)} GB`;
    }
    return `${MB.toFixed(2)} MB`;
  };

  const updateData = (response) => {
    const dataUsageFormatted = convertBytes(response.dataUsage);
    const speedKBps = response.speed / 1000;
    const speedMBps = speedKBps / 1000;

    let speedFormatted;
    if (speedMBps >= 1) {
      speedFormatted = `${speedMBps.toFixed(2)} MB/s`;
    } else {
      speedFormatted = `${speedKBps.toFixed(2)} KB/s`;
    }

    document.getElementById('dataUsage').textContent = `Data Usage: ${dataUsageFormatted}`;
    document.getElementById('speed').textContent = `Speed: ${speedFormatted}`;
  };

  chrome.runtime.sendMessage({ type: 'getNetworkData' }, response => {
    if (response) {
      updateData(response);
    } else {
      document.getElementById('dataUsage').textContent = 'Data Usage: Error';
      document.getElementById('speed').textContent = 'Speed: Error';
    }
  });

  // Listen for updates from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'updateNetworkData') {
      updateData(request);
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      document.getElementById('location').textContent = `Location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    }, error => {
      document.getElementById('location').textContent = `Location: Error (${error.message})`;
    });
  } else {
    document.getElementById('location').textContent = 'Location: Geolocation not supported';
  }

  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      document.getElementById('ip').textContent = `IP Address: ${data.ip}`;
    })
    .catch(error => {
      document.getElementById('ip').textContent = `IP Address: Error (${error.message})`;
    });
});
