use employee_db; 

insert into department(name)
values ('sales'), 
('finance'),
('retail');

insert into role(title, salary, department_id)
values ('sales manager', 50000, 1 ), 
('salesman', 30000, 1),
('finance manager', 60000, 2),
('financer', 40000, 2),
('retail manager', 45000, 3),
('retailer', 35000, 3); 

insert into employee(first_name, last_name, role_id, manager_id)
values ('jaryodd', 'carter', 3, null ), 
('kavion', 'carter', 1, null),
('dildred', 'carter', 5, null),
('buddy', 'rhodes', 2, 2),
('shana', 'rhodes', 4, 1),
('jaben', 'capers', 6, 3); 
