import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import {checkIdParam} from "../middlewares/deviceIdParam.middleware";
import DataService from "../modules/services/data.service";
import Joi from 'joi';

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];


class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    private dataService = new DataService();
 
    constructor() {
        this.initializeRoutes();
        this.dataService = new DataService();
    }
 
    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.get(`${this.path}/latest/:id`, checkIdParam, this.getAllDeviceData);
        this.router.get(`${this.path}/:id`, checkIdParam, this.getNumberById);
        this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
        this.router.delete(`${this.path}/:id`, checkIdParam, this. deleteDeviceData);
        this.router.delete(`${this.path}/all`, this. deleteAllDevicesData);
    }

    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);
        response.status(200).json(allData);
    };

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;

        const schema = Joi.object({
            air: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number().integer().positive().required(),
                        value: Joi.number().positive().required()
                    })
                )
                .unique((a, b) => a.id === b.id),
            deviceId: Joi.number().integer().positive().valid(parseInt(id, 10)).required()
});

        const data = {
            temperature: air[0].value,
            pressure: air[1].value,
            humidity: air[2].value,
            deviceId: Number(id),
            readingDate: new Date()
        };

        try {
            await this.dataService.createData(data);
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    };

     private getLatestReadingsFromAllDevices = async (request: Request, response: Response) => {
                try {
            const allLatest = await this.dataService.getAllNewest();
            response.status(200).json(allLatest);
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    }

    private getNumberById = async (request: Request, response: Response) => {
        const { id } = request.params
        const index = Number(id)-1
        if(isNaN(index))
        {
            response.status(400).send("ID must be a number");
            return;
        }
        else if(index < 0)
        {
            response.status(400).send("ID must be larger than 1");
            return;
        }
        else if(index >= testArr.length)
        {
            response.status(400).send("ID is bigger than array length");
            return;
        }
        else
        {
            response.json(testArr[index]);
            return;
        }
    }

    private deleteDeviceData = async (request: Request, response: Response) => {
               const { id } = request.params;
        try {
            const result = await this.dataService.deleteData(id);
            response.status(200).json({ message: 'Device data deleted.', result });
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    }

     private deleteAllDevicesData = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const deviceCount = 17;
            const results = await Promise.all(
                Array.from({ length: deviceCount }, (_, i) => this.dataService.deleteData(i.toString()))
            );
            response.status(200).json({ message: 'All devices data deleted.', results });
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    };

 }
 
 export default DataController;
 