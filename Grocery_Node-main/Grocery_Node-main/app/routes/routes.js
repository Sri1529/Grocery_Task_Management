module.exports=app=>
{
    const usercontroller=require("../controller/userscontroller");
    const usergroupscontroller=require("../controller/usergroupscontroller");
    const taskcontroller=require("../controller/taskscontroller")
    const mastergrocerycontroller=require("../controller/mastergrocerycontroller")
    const groupscontroller = require("../controller/groupscontroller")
    const groupgrocery = require("../controller/group_grocery_controller")
    

    app.get('/users',usercontroller.namephone)
    app.get('/users/id',usercontroller.selectid)
    app.get('/user_details',usercontroller.get_select_id_name)
    app.get('/users/phone',usercontroller.select_phone)
    app.get('/users/name',usercontroller.get_name_with_phone)


    app.get('/groups', usergroupscontroller.select_grpname_with_phone)
    app.get('/user_groups',usergroupscontroller.name_with_grpname)
    app.get('/user_groups',usergroupscontroller.get_name)
    app.get('/user_groups/names',usergroupscontroller.distinct_name)
    app.get('/user_groups/name',usergroupscontroller.getname)
    app.get('/groups/:groupName',usergroupscontroller.select_grpid)
    app.post('/user_groups', usergroupscontroller.insert_datas)



    app.post('/tasks',taskcontroller.insert_task)
    app.get('/tasks/:groupId/:phone',taskcontroller.display_task)
    app.put('/update-completed-on',taskcontroller.update_completed_on)


    app.get('/mastergrocery',mastergrocerycontroller.select_name)


    app.post('/groups',groupscontroller.insert_grp_datas)
    app.get('/get_group_id',groupscontroller.get_gro_id)



    app.post('/group_groceries',groupgrocery.insert_grpid_name)
    app.get('/group_groceries_names',groupgrocery.select_name)
}