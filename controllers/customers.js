const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();


const createCustomer = async (req, res) => {
    const { customer_id, first_name, last_name, address, email, phone_number } = req.body;
    try {
        // Create a new customer
        const cust = await prisma.customers.create({
            data: {
                customer_id,
                first_name,
                last_name,
                address,
                email,
                phone_number
            }
        });
        // return the created customer
        res.status(200).json({
            status: "ok",
            message: `User with ID ${cust.customer_id} created successfully`,
        });
    } catch (error) {

        res.status(500).json({
            status: "error",
            message: "Failed to create user",
            error: err.message
        });
    }
};

const getCustomers = async (req, res) => {
    const custs = await prisma.customers.findMany();
    res.json(custs)
};

const deleteCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        //ตรวจสอบ
        const existingCustomer = await prisma.customers.findUnique({
            where: {
                customer_id: Number(id),
            }
        });
        //ถ้าไม่มี
        if (!existingCustomer) {
            return res.status(404).json({message: 'Customer not found'});

        }
        //ลบลูกค้า
        await prisma.customers.delete({
            where: {
                customer_id: Number(id),
            }
        });
        //ส่งคำตอบ
        res.status(200).json({
            status: "ok",
            message: "User deleted successfully",
        });

    } catch (err) {
        console.error('Delete customer error:', err); 
        res.status(500).json({ error: err.message});
    }
}

//get customer by id
const getCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        const cust = await prisma.customers.findUnique({ //ค้นหาข้อมูลลูกค้าโดยใช้ id
            where: {
                customer_id: Number(id),
            },
        });
        if (!cust) {
            return res.status(404).json({'message': `Customer not found`}); //ถ้าไม่มีข้อมูลลูกค้า
        } else {
            res.status(200).json(cust); //ส่งข้อมูลลูกค้า
        }
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json(err);
    }
};

//update customer
const updateCustomer = async (req, res) => {
    const { customer_id, first_name, last_name, address, email, phone_number } = req.body;
    const {id} = req.params; //รับค่า id จาก url

    const data = {};
        if (first_name) data.first_name = first_name;
        if (last_name) data.last_name = last_name;
        if (address) data.address = address;
        if (email) data.email = email;
        if (phone_number) data.phone_number = phone_number;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({  
            status: "error",
            message: 'No Data provided for update.'
        }); //ถ้าไม่มี id
    }

    try {
        const cust = await prisma.customers.update({
            data,
            where: {customer_id: Number(id)},
        });
        res.status(200).json({
            status: "ok",
            message: `User with ID ${cust.customer_id} updated successfully`, //ส่งข้อมูลลูกค้าที่อัพเดทแล้ว
            user: cust
        });
    } catch (err) {
        if (err.code === 'P2002') {
            //เช็คว่า email ซ้ำหรือไม่
            res.status(400).json({
                status: "error",    
                message: 'Email already exists'
            });
        } else if (err.code === 'P2025') {
            //เช็คว่า phone_number ซ้ำหรือไม่
            res.status(404).json({
                status: "error",
                message: `User with ID = ${id} not found`
            });
        }else {
            //error อื่นๆ
            console.error('Update user error:', err);
            res.status(500).json({
                status: "error",
                message: 'Failed to update user',
            });
        }
    }
}
module.exports = {
    createCustomer, getCustomers, deleteCustomer, getCustomer, updateCustomer
};