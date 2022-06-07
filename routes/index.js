var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var conn = require('../lib/db');
var salary_dets;

function getSalary(func){
  var salarySQL = "SELECT COUNT(em.id) AS tot_employees , SUM(ep.salary) AS tot_salary," + 
  " max(ep.salary) AS max_salary," +
  " min(ep.salary) AS min_salary," +
  " avg(ep.salary) AS avg_salary" +
  " FROM employees.employees em , employees.payscales ep" +
  " WHERE ep.id = em.id AND NOT ep.tier = 'volunteer' "

  conn.query(salarySQL  , (err,rows) =>{
    if(err){
      return func('error')
    }else{
     return func(rows);
    }
  })

}






router.get('/', function(req, res, next) {

getSalary(function func(result){
  salary_dets = result;
})

// Normal stuff
var employeeSQL = "SELECT em.f_name , em.l_name , ep.tier , ep.salary" +
" FROM employees.employees em , employees.payscales ep" +
" WHERE ep.id = em.id AND NOT ep.tier = 'volunteer'"

conn.query(employeeSQL , (err,rows) => {
  if(err) throw err
    res.render('index', { title: 'Employee Salaries' , data:rows ,salary_dets: salary_dets });
})


});

module.exports = router;
