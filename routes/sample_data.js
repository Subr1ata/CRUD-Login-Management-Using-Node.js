var express = require('express');

var router = express.Router();

var database = require('../database');

// router.get("/",function(request, response, next){
//     response.send('List all Sample Data')
// });

// router.get("/add",function(request,response,next){
//     response.send('Add Sample Data');
// });

router.get("/",function(request,response,next){
    var query = "SELECT * FROM registration ORDER BY id DESC";
    database.query(query,function(error,data){

        if(error){
            throw error;
        }else{
            response.render('sample_data',{title:'User Management', action: 'list',sampleData:data});
        }
    });
});

router.get("/add", function(request,response,next){

    response.render("sample_data",{title:'Insert Data into MySQL', action:'add'});

});

router.post("/add_sample_data",function(request,response,next){
    var user_name = request.body.user_name;

    var email_id = request.body.email_id;

    var password = request.body.password;

    var confirm_password = request.body.confirm_password;

    if(password == confirm_password){
        var query = `
        INSERT INTO registration 
        (username, email, password)
        VALUES ("${user_name}","${email_id}","${password}")
        `;
    }else{
        throw 'Password Not Matched';
    }

    database.query(query, function(error,data){

        if(error)
        {
            throw error;
        }
        else
        {
            response.redirect("/sample_data");
        }
    });

});

router.get('/view/:id',function(request,response,next){

    var id = request.params.id;

    var query = `SELECT id,username,email FROM registration WHERE id = "${id}"`;

    database.query(query,function(error,data){
        response.render('sample_data', {title: 'View User', action:'view',sampleData:data});
    });
});

router.get('/edit/:id', function(request,response, next){
    
    var id = request.params.id;
    
    var query = `SELECT * FROM registration WHERE id="${id}"`;
    
    database.query(query,function(error,data){
        response.render('sample_data', {title:'Edit User', action:'edit', sampleData:data[0]});
    });
});

router.post('/edit/:id', function(request,response,next){
    var flag = true;

    var id = request.params.id;

    var user_name = request.body.user_name;

    var password = request.body.password;

    var confirm_password = request.body.confirm_password;

    if(password != confirm_password){
        response.send(`<h2>Password Does Not Match</h2>`);
        response.redirect("/edit/:id",'Password not matched');
    }else{
        var query = `
        UPDATE registration 
        SET username = "${user_name}", 
        password = "${password}",
        confirm_password = "${confirm_password}" 
        WHERE id = "${id}"
        `;

        database.query(query,function(error, data){

            if(error)
            {
                throw error;
            }
            else
            {
                response.redirect('/sample_data');               
            }
        });
    }

});

router.get('/delete/:id', function(request,response,next){

    var id = request.params.id;

    var query = `
    DELETE FROM registration WHERE id = "${id}"
    `;

    database.query(query, function(error,data){

        if(error)
        {
            throw error;
        }
        else
        {
            response.redirect("/sample_data");
        }
    });

});

module.exports = router;