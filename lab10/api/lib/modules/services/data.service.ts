import DataModel from '../schemas/data.schema';
import {IData, Query} from "../models/data.model";
import { config } from '../../config';

export default class DataService {

    public async createData(dataParams: IData) {
    try {
        const dataModel = new DataModel(dataParams);
        await dataModel.save();
    } catch (error) {
        console.error('Wystąpił błąd podczas tworzenia danych:', error);
        throw new Error('Wystąpił błąd podczas tworzenia danych');
    }
    }

    public async query(deviceID: string) {
    try {
        const data = await DataModel.find({deviceId: deviceID}, { __v: 0, _id: 0 });
        return data;
    } catch (error) {
        throw new Error(`Query failed: ${error}`);
    }
    }

    public async get(deviceId: string) {
        try {
            const newest = await DataModel
                .find({ deviceId: deviceId }, { __v: 0, _id: 0 })
                .sort({ $natural: -1 })
                .limit(1);
            return newest[0] || null;
        } catch (error) {
            throw new Error(`Błąd podczas pobierania najnowszego wpisu: ${error}`);
        }
    }

    public async getAllNewest() {
        const deviceCount = config.supportedDevicesNum || 17;
        const results = await Promise.all(
            Array.from({ length: deviceCount }, async (_, i) => {
                try {
                    const latestEntry = await DataModel
                        .find({ deviceId: i }, { __v: 0, _id: 0 })
                        .limit(1)
                        .sort({ $natural: -1 });
                    if (latestEntry.length) {
                        return latestEntry[0];
                    } else {
                        return { deviceId: i };
                    }
                } catch (error: any) {
                    return { deviceId: i, error: error.message };
                }
            })
        );
        return results;
    }

    public async deleteData(deviceId: string) {
        try {
            const result = await DataModel.deleteMany({ deviceId: deviceId });
            return result;
        } catch (error) {
            throw new Error(`Błąd podczas usuwania danych urządzenia ${deviceId}: ${error}`);
        }
    }
}