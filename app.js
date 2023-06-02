const express = require('express')
const fs = require('fs')
const app = express()
//this line is required to parse the request body
app.use(express.json())
/* Create - POST method */
app.post('/user/add', (req, res) => {
    //get the existing user data
    const existUsers = getUserData()
    
    //get the new user data from post request
    const userData = req.body
    //append the user data
    existUsers.push(userData)
    //save the new user data
    saveUserData(existUsers);
    res.send(userData)
})
/* Read - GET method */
app.get('/user/list', (req, res) => {
    const users = getUserData()
    res.send(users)
})
/* Update - Patch method */
app.patch('/user/update/:hospital_name', (req, res) => {
    //get the username from url
    const hospital_name = req.params.hospital_name
    //get the update data
    const userData = req.body
    //get the existing user data
    const existUsers = getUserData()
    //check if the username exist or not       
    const findExist = existUsers.find( user => user.hospital_name === hospital_name)
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'hospital not exist'})
    }
    //filter the userdata
    const updateUser = existUsers.filter( user => user.hospital_name !== hospital_name )
    //push the updated data
    updateUser.push(userData)
    //finally save it
    saveUserData(updateUser)
    res.send({userData, msg: 'hospital data updated successfully'})
})
/* Delete - Delete method */
app.delete('/user/delete/:hospital_name', (req, res) => {
    const hospital_name= req.params.hospital_name
    //get the existing userdata
    const existUsers = getUserData()
    //filter the userdata to remove it
    const filterUser = existUsers.filter( user => user.hospital_name !== hospital_name)
    if ( existUsers.length === filterUser.length ) {
        return res.status(409).send({error: true, msg: 'hospital does not exist'})
    }
    //save the filtered data
    saveUserData(filterUser)
    res.send({success: true, msg: 'hospital removed successfully'})
    
})
/* util functions */
//read the user data from json file
const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('users.json', stringifyData)
}
//get the user data from json file
const getUserData = () => {
    const jsonData = fs.readFileSync('users.json')
    return JSON.parse(jsonData)    
}
/* util functions ends */
//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})