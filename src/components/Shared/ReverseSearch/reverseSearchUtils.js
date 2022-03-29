export const localImageGoogleSearch = (content) => {
   
    const blob = b64toBlob(content, 'image/png')
    let url = "https://www.google.com/searchbyimage/upload"
    const formData  = new FormData();
    formData.append("encoded_image", blob)
    fetch(url, {
        referrer: '',
        mode: 'cors',
        method: 'POST',
        body: formData
    }).then(response => {
        console.log("response ", response)
        window.open(response.url, "_blank");
    })
    .catch(error => {
      console.error(error)
    })
}

export const localImageBingSearch = (content) => {
    let image = content.substring(content.indexOf(',') + 1)
    let url = "https://www.bing.com/images/search?view=detailv2&iss=sbiupload&FORM=SBIHMP&sbifnm=weverify-local-file"
    const formData  = new FormData()
    formData.append("data-imgurl", "")
    formData.append("cbir", "sbi")
    formData.append("imageBin", image)
    fetch(url, {
      
        method: 'POST',
        body: formData
    }).then(response => {
        //console.log("response ", response)
        window.open(response.url, "_blank");
    })
    .catch(error => {
      console.error(error)
    })
}

const b64toBlob = (content, contentType='', sliceSize=512) => {
    let image = content.substring(content.indexOf(',') + 1)
    const byteCharacters = atob(image);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }