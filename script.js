const searchBox = document.querySelector(".searchBox")
const inputvalue = document.querySelector(".inputbox")
const userprofile = document.querySelector(".userprofile")
const repositories = document.querySelector(".repositories")
const pagination = document.querySelector(".pagination")
const next = document.querySelector(".next")
const prev = document.querySelector(".prev")
let count=1
let user=''

searchBox.addEventListener("submit", async (event) => {
    event.preventDefault()
    user = inputvalue.value
    if (user) {
        try {
            const userdata = await getGithubApi(user)
            displayProfile(userdata)

            const repodata = await getGithubRepoApi(user, count)
            displayGithubRepoData(repodata,count)
            
        }
        catch (error) {
            displayError("Please enter valid username")
        }
    }
    else {
        displayError("Please enter username")
    }
    
})

next.addEventListener("click",async(event)=>{
    count+=1
    const userdata = await getGithubApi(user)
    displayProfile(userdata)
    event.preventDefault()
    const repodata = await getGithubRepoApi(user, count)
    displayGithubRepoData(repodata,count)
})
prev.addEventListener("click",async(event)=>{
    count-=1
    const userdata = await getGithubApi(user)
    displayProfile(userdata)
    event.preventDefault()
    const repodata = await getGithubRepoApi(user, count)
    displayGithubRepoData(repodata,count)
})

async function getGithubApi(user) {
    const githubApi = `https://api.github.com/users/${user}`
    response = await fetch(githubApi)
    if (!response.ok) {
        throw new Error("Username is invalid")
    }
    return await response.json()
}
function displayProfile(data) {
    const { name: nameValue, bio: bioValue, avatar_url: image, public_repos: noOfRepos } = data
    userprofile.style.display = "flex"
    userprofile.textContent = ``
    userprofile.innerHTML = `<img src="${image}" alt="profile image" class="avatar"></span>
    <div class="item">
        <div class="username">Username - ${nameValue}</div>
        <span class="repoNos">Number of Repositories -${noOfRepos}</span>
        <p class="bio">Bio-${bioValue}</p>
    </div>`
}
async function getGithubRepoApi(user, count) {
    const githubRepoApi = `https://api.github.com/users/${user}/repos?page=${count}&per_page=10`
    response = await fetch(githubRepoApi)
    if (!response.ok) {
        throw new Error("Username is invalid")
    }
    return await response.json()

}

async function displayGithubRepoData(data, count) {
    repositories.textContent = ``;
    repositories.style.display = "flex";
    for (let i = 0; i < data.length; i++) {
        temp = data[i]
        const { name: nameValue, html_url: repoUrl, description: descValue, topics: topicValue } = temp

        repositories.innerHTML += `<div class="repository">
        <a class="repoName" target="_blank" href="${repoUrl}">${nameValue}</a>
        <span class="description">${descValue}</span>
        <span class="topics">${topicValue.join(', ')}</span>
    </div>`
    }
    if(count===1){
        pagination.style.display="inline-block"
        prev.style.display="none"
        next.style.display="inline-block"
    }
    else if (data.length!==10){
        pagination.style.display="inline-block"
        next.style.display="none"
        prev.style.display="inline-block"
    }
    else{
        pagination.style.display="inline-block"
        prev.style.display="inline-block"
        next.style.display="inline-block"
    }

}
async function getDataAndDisplayNextPage(user,count1) {
    count=count1
    const temp =await getGithubApi(user, count1);
    displayGithubRepoData(temp, count1);
}
function displayError(message) {
    userprofile.style.display = "flex"
    userprofile.innerHTML = `<div class="item">
    <div class="username displayerror" >${message}</div></div>`
}