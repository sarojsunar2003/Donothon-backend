const routes = require("express").Router()

const userControllers = require("../Controllers/UserController")

routes.post("/addUser",userControllers.addUser)
routes.post("/signIn",userControllers.signIn)
routes.get("/getProfileById/:id",userControllers.getProfileById)
routes.put("/updateuser/:id",userControllers.updateProfile)
routes.put("/deleteuser/:id",userControllers.deleteProfile)
routes.post("/user/forgotpassword",userControllers.forgotPassword)
routes.get("/user/resetpassword/:token",userControllers.resetpassword)
routes.post("/user/resetpassword",userControllers.resetpassword)
module.exports = routes     