
/**
 * DragonDoc
 * 
 * @Author: titaro
 * @FB: facebook.com/tyroklonejr
 * @Github: github.com/tyroklone
 * 
 * @License: none
 * @Contribution: Allowed
 * @AIM: Building a dynamic and user friend doc site for dragon
 */

/**
 * Module Pattern
 */

const variableController = (() => {

    /**
     * Variable declaration
     * All variables must be declared here
     */

    let variables = {

        // Vars
        main: document.getElementById('main'),
        section: document.getElementById('sect'),
        listing: document.getElementById('listing'),
        content: document.getElementById('content'),
        loader: document.getElementById('loader'),
        sectText: document.getElementById('sect-text'),

        // URL
        url: `https://api.github.com/repos/austinHeisleyCook/dragondocsrepo/contents`,

        // Method
        customUrl: function(path) {
            return `https://api.github.com/repos/austinHeisleyCook/dragondocsrepo/contents/${path}`;
        }
    }

    return function(name) {
        return variables[name];
    }

})();

// Loader Controller
const loaderController = (getVar, showLoader, sectionText) => {
    let loader = getVar('loader');
    let sectText = getVar('sectText');

    if(showLoader === true) {
        loader.style.display = 'block';
    }
    else {
        loader.style.display = 'none';
    }

    if(sectionText !== null) {
        sectText.style.display = 'inline-block';
        sectText.textContent = sectionText;
    }
    else {
        sectText.style.display = 'none';
    }
};

// Content Controller
const contentController = (e, getVar, filePath) => {
    console.log('File clicked.');

    let lis = getVar('listing');
    let content = getVar('content');

    // Loader
    loaderController(getVar, true, null);


    lis.style.display = 'none';

    // New Request
    let fileUrl = getVar('customUrl')(filePath);
    console.log(fileUrl);

    let newXhr = new XMLHttpRequest();

    newXhr.open('GET', fileUrl, true);

    newXhr.onload = function() {

        if(this.status == 200) {

            let response = JSON.parse(this.response);

            // Loader
            loaderController(getVar, false, response.name);

    
            console.log(response);
    
            let cont = document.createElement('div');

            cont.innerHTML = atob(response.content);
            content.appendChild(cont);
        }
    };

    newXhr.send();
    
};

// Folder Controller
const folderController = (e, getVar) => {

    let sec = getVar('section');
    let lis = getVar('listing');

    loaderController(getVar, true, null);

    sec.style.display = 'none';
    
    // New Request
    let reqUrl = getVar('customUrl')(e.target.textContent);
    console.log(reqUrl);

    let newXhr = new XMLHttpRequest();

    newXhr.open('GET', reqUrl, true);

    newXhr.onload = function() {

        if(this.status == 200) {

            let response = JSON.parse(this.response);
    
            for(const key in response) {
    
                console.log(response);
                loaderController(getVar, false, 'Section Content');

    
                let ext = response[key].name.match(/.html/);
    
                let ele = document.createElement('div');
                
                if(ext !== null) {
                    
                    // Create new element
                    let eleText = document.createTextNode(response[key].name);
                    ele.appendChild(eleText);
                    ele.setAttribute('id', `dragon-${response[key].name}`);
        
                    lis.appendChild(ele);
        
                    ele.addEventListener('click', (e) => {
                        contentController(e, getVar, response[key].path);
                    });
                }
                else {
                    console.log('None allowed file extension detected!');
                }
            }

        }

    };

    newXhr.send();
    console.log(e);
};


// Section Controller
const sectionController = ((getVar) => {

    // Show loader
    loaderController(getVar, true, null);

    // REQUEST
    let xhr = new XMLHttpRequest();
    
    xhr.open('GET', getVar('url'), true);
    
    xhr.onload = function() {

        if(this.status == 200) {

            let response = JSON.parse(this.response);
            console.log(response);
       
            let ul = document.createElement('ul');
            ul.className = 'clear';
       
            for(let i in response) {
    
                if(response[i].type === "dir") {

                    // Remove loader
                    loaderController(getVar, false, 'Section');
      
                    // Elements and insert
                    let li = document.createElement('li');
                    let text = document.createTextNode(response[i].name);
                    li.appendChild(text);
                    li.setAttribute('id', `dragon-${response[i].name}`);
                    ul.appendChild(li);
                    getVar('section').appendChild(ul);
            
                    li.addEventListener('click', e => {
                        folderController(e, getVar);
                    });
                }
            }
        }
        else {
            console.log('ERROR!!!');
        }
    };
    
    xhr.send();
})(variableController);

