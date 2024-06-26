

// let dataUsage = 0;
// let startTime = Date.now();

// chrome.webRequest.onCompleted.addListener(details => {
//   const now = Date.now();
//   const dataSize = parseInt(details.responseHeaders.find(header => header.name.toLowerCase() === 'content-length')?.value || 0);

//   dataUsage += isNaN(dataSize) ? 0 : dataSize;

//   const elapsedTime = (now - startTime) / 1000; // in seconds
//   const speed = dataUsage / elapsedTime; // bytes per second

//   chrome.storage.local.set({ dataUsage, speed });
// }, { urls: ["<all_urls>"] }, ["responseHeaders"]);

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'getNetworkData') {
//     chrome.storage.local.get(['dataUsage', 'speed'], result => {
//       sendResponse(result);
//     });
//     return true; // Indicate that the response is asynchronous
//   }
// });

let dataUsage = 0;
let startTime = Date.now();

chrome.webRequest.onCompleted.addListener(details => {
  const now = Date.now();
  const dataSize = parseInt(details.responseHeaders.find(header => header.name.toLowerCase() === 'content-length')?.value || 0);

  dataUsage += isNaN(dataSize) ? 0 : dataSize;

  const elapsedTime = (now - startTime) / 1000; // in seconds
  const speed = elapsedTime > 0 ? dataUsage / elapsedTime : 0; // bytes per second

  chrome.storage.local.set({ dataUsage, speed });

  // Notify popup of the update
  chrome.runtime.sendMessage({ type: 'updateNetworkData', dataUsage, speed });
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getNetworkData') {
    chrome.storage.local.get(['dataUsage', 'speed'], result => {
      sendResponse(result);
    });
    return true; // Indicate that the response is asynchronous
  }
});
