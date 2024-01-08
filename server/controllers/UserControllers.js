const mongoose = require("mongoose")
const ObjectId = require("mongoose")
const User = require("../models/User")

exports.findUserByToken = async(req, res)=>{
    try {
        // console.log(" in the controller")
        // console.log(req.params)
        const {token} = req.params

        if(!token){
            return res.status(400).json({
                success: false,
                message: "No Token Found !!"
            })
        }

        // console.log(token)

        const user = await User.findOne({token}).populate({
            path: "contacts",
            select: "firstName lastName profilePhoto additionalInfo",
            populate: ({
                path: 'additionalInfo',
                model: "Profile",
                select: "about isActive"
            })
        })

        // console.log(user)
        if(!user){
            return res.status(400).json({
                success:false,
                message: "No User found with this token !!"
            })
        }

        user.password = undefined

        return res.status(200).json({
            success: true,
            message: "User Found!!",
            user
        })

    } catch (error) {
        return res.status(500).json({
            suucess: false,
            message: `Internal Server Error: ${error}`
        })
    }
}

// exports.fetchContacts = async(req, res)=>{
//     try {
//         const { id } = req.params;
//         const contacts = await User.findOne({_id:id}).select('contacts').populate({
//             path: 'contacts',
//             model: "User",
//             select: "firstName lastName profilePhoto"
//         })

//         return res.status(200).json({
//             success: true,
//             message: "Contacts Fetched!!",
//             contacts
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }

// async function fetchUserContacts(id){
//     try {
//         const {contacts} = await User.findById(id).select('contacts')
//         if(!contacts){
//             throw new Error("Contacts are not found")
//         }
//         else{
//             return contacts
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }

exports.addToContacts = async (req, res) =>{
    try {
        const { id, contactId } = req.body
        // console.log(`Id: ${id} contact id: ${contactId}`)
        
        const {contacts} = await User.findById(id).select('contacts')
        // populate({
        //     path: 'contacts',
        //     model: 'User',
        //     select: "_id ",
        // })
    
        // contacts.forEach(contact => {
        //     console.log(contact.toString())
        // });
        // console.log("Contacts are: ",contacts);
        // contacts.map((contact)=>{
        //     console.log(contact)
        // })
        // console.log(contacts)
        const isContactAlreadyAdded = (contacts.filter((contact)=> contact.toString() === contactId)).length ;
        // console.log(isContactAlreadyAdded)
        if(isContactAlreadyAdded !== 0){
            return res.status(409).json({
                success: false,
                message: 'This Contact is already in your list'
            })
        }
        // console.log("pushing contact")
        const updatedUser = await User.findByIdAndUpdate(
            {_id: id},
            {$push: {"contacts": contactId}},
            {new: true}
        )
        
        console.log(updatedUser)

        return res.status(200).json({
            success: true,
            message: `Contact Added successfully!!`,
            updatedUser
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            suucess: false,
            message: `Internal Server Error: ${error}`
        })
    }
}

exports.removeFromContacts = async(req, res)=>{
    try {
        const { id, contactId } = req.body
        // console.log(`Id: ${id} contact id: ${contactId}`)

        // const user = await User.findById(id)
        // .populate({
        //     path: 'contacts',
        //     model: "User",
        //     select: "_id"
        // })
        
        // console.log(user)

        // const updatedUser = await user.updateOne(
        //     {_id: id},
        //     {
        //         $pullAll: { 
        //             contacts: {
        //                 _id: {
        //                     $eq: contactId
        //                 }
        //             }
        //         }
        //     },
        //     {new: true}
        // )

        const updatedUser = await User.findOneAndUpdate(
            {_id: id},
            {
                $pull:{contacts: contactId}
            },
            {new: true},
        )

        console.log(updatedUser)

        res.status(200).json({
            success: true,
            message: `Contact Deleted successfully!!`,
            updatedUser
        })
        
    } catch (error) {
        return res.status(500).json({
            suucess: false,
            message: `Internal Server Error: ${error}`
        })
    }
}