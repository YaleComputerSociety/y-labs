import { UserBackup } from "@/lib/models";
import { NotFoundError } from "@/lib/utils/errors";
import mongoose from "mongoose";

export const createUserBackup = async (userData: any) => {
    try {
        const user = new UserBackup(userData);
        await user.save();
        return user.toObject();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Unknown error occurred while creating user backup');
    }
};

export const readAllUserBackups = async () => {
    try {
        const users = await UserBackup.find();
        return users.map(user => user.toObject());
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Unknown error occurred while reading user backup');
    }
};

export const readUserBackup = async(id: any) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await UserBackup.findById(id);
        if (!user) {
            throw new NotFoundError(`User backup not found with ObjectId: ${id}`);
        }
        return user.toObject();
    } else {
        const user = await UserBackup.findOne({ netid: { $regex: `^${id}$`, $options: 'i'} });
        if (!user) {
            throw new NotFoundError(`User backup not found with NetId: ${id}`);
        }
        return user.toObject();
    }
};

export const userBackupExists = async(id: any) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await UserBackup.findById(id);
        if (!user) {
            return false;
        }
        return true;
    } else {
        const user = await UserBackup.findOne({ netid: { $regex: `^${id}$`, $options: 'i'} });
        if (!user) {
            return false;
        }
        return true;
    }
}

export const updateUserBackup = async(id: any, data: any) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await UserBackup.findByIdAndUpdate(id, data,
            { new: true, runValidators: true}
        );
        if (!user) {
            throw new NotFoundError(`User backup not found with ObjectId: ${id}`);
        }
        return user.toObject();
    } else {
        const user = await UserBackup.findOneAndUpdate(
            { netid: { $regex: `^${id}$`, $options: 'i'} }, 
            data, 
            { new: true, runValidators: true }
        );
        if (!user) {
            throw new NotFoundError(`User backup not found with NetId: ${id}`);
        }
        return user.toObject();
    }
};

export const deleteUserBackup = async(id: any) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const user = await UserBackup.findByIdAndDelete(id);
        if (!user) {
            throw new NotFoundError(`User backup not found with ObjectId: ${id}`);
        }
        return user.toObject();
    } else {
        const user = await UserBackup.findOneAndDelete({ netid: { $regex: `^${id}$`, $options: 'i'} });
        if (!user) {
            throw new NotFoundError(`User backup not found with NetId: ${id}`);
        }
        return user.toObject();
    }
}