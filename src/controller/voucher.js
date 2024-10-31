import {Voucher} from "../model/voucher";

export const CreateVoucher = async (req, res) => {
    try {
        const data=await Voucher(req.body).save();
        return res.status(200).json({
            message:"Them thanh cong",
            data
        })
    }
    catch (e) {
        return res.status(500).json({
            message: e.message
        })
    }
}
export const getAllVoucher = async (req, res) => {
    try {
        const data=await Voucher.find();
        return res.status(200).json(
            data
        )
    }catch (e) {
        return res.status(500).json({
            message: e.message
        })
    }
}