import model from '../models';
import { v4 as uuidv4 } from 'uuid';
import response from '../libs/responseLib';
import check from '../libs/checkLib';
import logger from '../libs/loggerLib';
import userAuthentication from '../middlewares/userAuthentication';
import client from '../libs/statsdLib';

const { Assignment } = model;

const getAllAssignments = async (req, res) => {
    client.increment('getAllAssignments');
    if (req.headers['content-type'] !== undefined && req.headers['content-length'] > 0) {
        let apiResponse = response.generate(true, 'No Body Expected', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    let assignmentDetails;
    try {
        assignmentDetails = await Assignment.findAll();
    } catch (err) {
        logger.error(err.message, 'Assignment Controller: getAllAssignments', 10);
        let apiResponse = response.generate(true, 'Failed to find Assignment Details', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (!check.isEmpty(assignmentDetails)) {
        let apiResponse = response.generate(false, 'Assignments Found', 200, assignmentDetails);
        res.status(apiResponse.status).send(assignmentDetails);
        return;
    } else {
        logger.info('No Assignments Found', 'Assignment Controller:getAllAssignments')
        let apiResponse = response.generate(true, 'No Assignments Found', 404, null);
        res.status(apiResponse.status).send();
        return;
    }
};

const getAssignmentById = async (req, res) => {
    client.increment('getAssignmentById');
    if (req.headers['content-type'] !== undefined && req.headers['content-length'] > 0) {
        let apiResponse = response.generate(true, 'No Body Expected', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    let assignmentDetails;
    let assignmentId;
    if (req.params.id) {
        assignmentId = req.params.id;
    } else {
        let apiResponse = response.generate(true, 'Missing ID Parameter', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    try {
        assignmentDetails = await Assignment.findOne({ where: { id: assignmentId } });
    } catch (err) {
        logger.error(err.message, 'Assignment Controller: getAssignmentById', 10);
        let apiResponse = response.generate(true, 'Failed to find Assignment Details', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (!check.isEmpty(assignmentDetails)) {
        let apiResponse = response.generate(false, 'Assignment Details Found', 200, assignmentDetails);
        res.status(apiResponse.status).send(assignmentDetails);
        return;
    } else {
        logger.info('No Assignment Found', 'Assignment Controller:getAssignmentById')
        let apiResponse = response.generate(true, 'No Assignment Found', 404, null);
        res.status(apiResponse.status).send();
        return;
    }
};

let assignmentCreateFunction = async (req, res) => {
    client.increment('createAssignments');

    let { name, points, num_of_attempts, deadline } = req.body;

    if (req.headers['content-type'] !== 'application/json' && req.headers['content-length'] == 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    }

    let userEmail = userAuthentication.getUserEmail(req, res);

    if (!name || !points || !num_of_attempts || !deadline) {
        let apiResponse = response.generate(true, 'Missing Parameters in Body', 400, null)
        res.status(apiResponse.status).send();
        return;
    }
    if (!(points > 0 && points <= 10)) {
        let apiResponse = response.generate(true, 'Points are not in range for assignment', 400, null)
        res.status(apiResponse.status).send();
        return;
    }
    let createAssignment = async () => {
        let newAssignment;
        return new Promise(async (resolve, reject) => {
            if (Object.keys(req.body).length > 0) {
                console.log(req.body)
                newAssignment = {};
                newAssignment.id = uuidv4();
                newAssignment.name = name;
                newAssignment.points = points;
                newAssignment['num_of_attempts'] = num_of_attempts;
                newAssignment.deadline = deadline;
                newAssignment.userId = userEmail;
                try {
                    await Assignment.create(newAssignment);
                } catch (err) {
                    console.log(err)
                    logger.error(err.message, 'assignmentController: createAssignment', 10)
                    let apiResponse = response.generate(true, 'Failed to create new Assignment', 400, null)
                    reject(apiResponse)
                }
                resolve(newAssignment);
            } else {
                logger.error('Body Not Present', 'assignmentController: createAssignment', 4)
                let apiResponse = response.generate(true, "Body not present", 400, null)
                reject(apiResponse)
            }
        })
    }



    createAssignment(req, res)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Assignment Created', 201, resolve);
            res.status(apiResponse.status).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status ? err.status : 400).send();
        })

}

const updateAssignment = async (req, res) => {
    client.increment('updateAssignments');
    let assignmentDetails;
    let assignmentId;
    let updatedDetails;
    let userEmail = userAuthentication.getUserEmail(req, res);
    if (req.headers['content-type'] !== 'application/json' && req.headers['content-length'] == 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    }
    Object.keys(req.body).map((key) => {
        if (key.toLowerCase().includes('assignment_created')) {
            delete req.body.assignment_created;
        }
        if (key.toLowerCase().includes('assignment_updated')) {
            delete req.body.assignment_updated;
        }
        if (key.toLowerCase().includes('id')) {
            delete req.body.id;
        }
        if (key.toLowerCase().includes('userid')) {
            delete req.body.userId;
        }
        if (key.toLowerCase().includes('points')) {
            if (!(req.body.points > 0 && req.body.points <= 10)) {
                let apiResponse = response.generate(true, 'Points are not in range for assignment', 400, null)
                res.status(apiResponse.status).send();
                return;
            }
        }
    });
    if (req.params.id) {
        assignmentId = req.params.id;
    } else {
        let apiResponse = response.generate(true, 'Missing ID Parameter', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    try {
        assignmentDetails = await Assignment.findOne({ where: { id: assignmentId } });
    } catch (err) {
        logger.error(err.message, 'Assignment Controller: getAssignmentById', 10);
        let apiResponse = response.generate(true, 'Failed to find Assignment Details', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (!check.isEmpty(assignmentDetails)) {
        if (userEmail == assignmentDetails.userId) {
            try {
                updatedDetails = await Assignment.update(req.body, { where: { id: req.params.id } });
            } catch (err) {
                let apiResponse = response.generate(true, 'Failed to update Assignment', 400, null)
                res.status(apiResponse.status).send();
                return;
            }
        } else {
            let apiResponse = response.generate(true, 'No Permissions for this user to edit this assignment', 403, null);
            res.status(apiResponse.status).send();
            return;
        }
        let apiResponse = response.generate(false, 'Assignment Details Updated', 204, updatedDetails);
        res.status(apiResponse.status).send();
        return;
    } else {
        logger.info('No Assignment Found', 'Assignment Controller:getAssignmentById')
        let apiResponse = response.generate(true, 'No Assignment Found', 404, null);
        res.status(apiResponse.status).send();
        return;
    }
};

const deleteAssignment = async (req, res) => {
    client.increment('deleteAssignments');
    let assignmentDetails;
    let assignmentId;
    let userEmail = userAuthentication.getUserEmail(req, res);
    if (req.headers['content-type'] !== undefined && req.headers['content-length'] > 0) {
        let apiResponse = response.generate(true, 'No Body Expected', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (req.params.id) {
        assignmentId = req.params.id;
    } else {
        let apiResponse = response.generate(true, 'Missing ID Parameter', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    try {
        assignmentDetails = await Assignment.findOne({ where: { id: assignmentId } });
    } catch (err) {
        logger.error(err.message, 'Assignment Controller: getAssignmentById', 10);
        let apiResponse = response.generate(true, 'Failed to find Assignment Details', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (!check.isEmpty(assignmentDetails)) {
        if (userEmail == assignmentDetails.userId) {
            try {
                await Assignment.destroy({ where: { id: req.params.id } });
            } catch (err) {
                let apiResponse = response.generate(true, 'Failed to delete Assignment', 400, null)
                res.status(apiResponse.status).send();
                return;
            }
        } else {
            let apiResponse = response.generate(true, 'No Permissions for this user to delete this assignment', 403, null);
            res.status(apiResponse.status).send();
            return;
        }
        let apiResponse = response.generate(false, 'Assignment Deleted', 204, null);
        res.status(apiResponse.status).send();
        return;
    } else {
        logger.info('No Assignment Found', 'Assignment Controller:getAssignmentById')
        let apiResponse = response.generate(true, 'No Assignment Found', 404, null);
        res.status(apiResponse.status).send();
        return;
    }
};

export default {
    getAllAssignments: getAllAssignments,
    getAssignmentById: getAssignmentById,
    createAssignment: assignmentCreateFunction,
    updateAssignment: updateAssignment,
    deleteAssignment: deleteAssignment
}