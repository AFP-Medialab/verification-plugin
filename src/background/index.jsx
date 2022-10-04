chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if(request.contentScriptQuery === "keyframes"){
            fetch((request.url), {
                mode: 'cors',
                method: 'POST',
                body: request.body
            })
            .then(response => {return response.json()})
            .then(json => {sendResponse(json)})
            .catch(errors => {sendResponse(errors)})
        }
    })