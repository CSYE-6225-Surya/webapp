import model from '../models';
import { v4 as uuidv4 } from 'uuid';
import response from '../libs/responseLib';
import check from '../libs/checkLib';
import logger from '../libs/loggerLib';
import userAuthentication from '../middlewares/userAuthentication';
import client from '../libs/statsdLib';
import AWS from 'aws-sdk';


const { Assignment } = model;
const { Submission } = model;

const publishToSNS = (userEmail, url, id, count, assignmentId) => {
    AWS.config.update({ region: process.env.AWS_REGION });
    const sns = new AWS.SNS();

    const snsArn = process.env.TOPIC_ARN; // Retrieve the SNS ARN from environment variables

    const message = {
        email: userEmail,
        url: url,
        id: id,
        count: count,
        assignmentId: assignmentId
    };

    const params = {
        TopicArn: snsArn,
        Message: JSON.stringify(message),
    };

    return sns.publish(params).promise();
}

const getAllAssignments = async (req, res) => {
    client.increment('getAllAssignments');
    if (req.headers['content-type'] !== undefined && req.headers['content-length'] > 0) {
        logger.error("No Body Expected", "Assignment Controller: getAllAssignments", 5);
        let apiResponse = response.generate(true, 'No Body Expected', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (typeof req.query == 'object' && Object.keys(req.query).length !== 0 && Object.values(req.query).length !== 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
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
        logger.info("Assignments Found", "Assignment Controller: getAllAssignments", 5);
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
        logger.error("No Body Expected", "Assignment Controller: getAssignmentById", 5);
        let apiResponse = response.generate(true, 'No Body Expected', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (typeof req.query == 'object' && Object.keys(req.query).length !== 0 && Object.values(req.query).length !== 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    }
    let assignmentDetails;
    let assignmentId;
    if (req.params.id) {
        assignmentId = req.params.id;
    } else {
        logger.error("Missing ID Parameter", "Assignment Controller: getAssignmentById", 5);
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
        logger.info("Assignment Details Found", "Assignment Controller: getAssignmentById", 10);
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
        logger.error("Body Expected", "Assignment Controller: createAssignments", 5);
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    }
    if (typeof req.query == 'object' && Object.keys(req.query).length !== 0 && Object.values(req.query).length !== 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    }

    let userEmail = userAuthentication.getUserEmail(req, res);

    if (!name || !points || !num_of_attempts || !deadline) {
        logger.error("Missing Parameters in Body", "Assignment Controller: createAssignments", 5);
        let apiResponse = response.generate(true, 'Missing Parameters in Body', 400, null)
        res.status(apiResponse.status).send();
        return;
    }
    if (!(points > 0 && points <= 10)) {
        logger.error("Points are not in range for assignment", "Assignment Controller: createAssignments", 5);
        let apiResponse = response.generate(true, 'Points are not in range for assignment', 400, null)
        res.status(apiResponse.status).send();
        return;
    }
    if (new Date(deadline) != "Invalid Date") {
        if (new Date(deadline) <= new Date()) {
            logger.error("Deadline is not latest", "Assignment Controller: createAssignments", 5);
            let apiResponse = response.generate(true, 'Deadline is not latest', 400, null)
            res.status(apiResponse.status).send();
            return;
        }
    } else {
        logger.error("Invalid Date for Assignment Deadline", "Assignment Controller: createAssignments", 5);
        let apiResponse = response.generate(true, 'Invalid Date for Assignment Deadline', 400, null)
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
            logger.error("Assignment Created", "Assignment Controller: createAssignments", 5);
            delete resolve.userId;
            let apiResponse = response.generate(false, 'Assignment Created', 201, resolve);
            res.status(apiResponse.status).send(resolve);
        })
        .catch((err) => {
            console.log(err);
            logger.error(err, "Assignment Controller: createAssignments", 5);
            res.status(err.status ? err.status : 400).send(err);
        })

}

let submissionCreateFunction = async (req, res) => {
    client.increment('createSubmissions');
    let assignmentDetails;
    let assignmentId;
    let submissionDetails;
    let { submission_url } = req.body;

    let userEmail = userAuthentication.getUserEmail(req, res);

    if (req.headers['content-type'] !== 'application/json' && req.headers['content-length'] == 0) {
        logger.error("Body Expected", "Assignment Controller: createSubmission", 5);
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    }
    if (typeof req.query == 'object' && Object.keys(req.query).length !== 0 && Object.values(req.query).length !== 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    }

    if (req.params.id) {
        assignmentId = req.params.id;
    } else {
        logger.error("Missing ID Parameter", "Assignment Controller: createSubmission", 5);
        let apiResponse = response.generate(true, 'Missing ID Parameter', 400, null);
        res.status(apiResponse.status).send();
        return;
    }

    if (!submission_url) {
        logger.error("Missing Parameters in Body", "Assignment Controller: createSubmission", 5);
        let apiResponse = response.generate(true, 'Missing Parameters in Body', 400, null)
        res.status(apiResponse.status).send();
        return;
    } else {
        let httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
        let result = httpRegex.test(submission_url);
        if (!result) {
            logger.error("Not a Valid URL", "Assignment Controller: createSubmission", 5);
            let apiResponse = response.generate(true, 'Not a Valid URL', 400, null)
            res.status(apiResponse.status).send();
            return;
        }
    }

    try {
        assignmentDetails = await Assignment.findOne({ where: { id: assignmentId } });
    } catch (err) {
        logger.error(err.message, 'Assignment Controller: createSubmission', 10);
        let apiResponse = response.generate(true, 'Failed to find Assignment Details', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (!check.isEmpty(assignmentDetails)) {
        try {
            submissionDetails = await Submission.findAll({ where: { assignment_id: assignmentId } });
        } catch (err) {
            logger.error(err.message, 'Assignment Controller: createSubmission', 10);
            let apiResponse = response.generate(true, 'Failed to find Submission Details', 400, null);
            res.status(apiResponse.status).send();
            return;
        }

        if (new Date(assignmentDetails?.deadline) < new Date()) {
            logger.error("Submission Deadline Reached", "Assignment Controller: createSubmission", 5);
            let apiResponse = response.generate(true, 'Submission Deadline reached', 400, null);
            res.status(apiResponse.status).send();
            return;
        }
        if (assignmentDetails?.num_of_attempts <= submissionDetails.length) {
            logger.error("Exceeded Submission Count", "Assignment Controller: createSubmission", 5);
            let apiResponse = response.generate(true, 'Exceeded submission count', 400, null);
            res.status(apiResponse.status).send();
            return;
        }

        let createSubmission = async () => {
            let newSubmission;
            return new Promise(async (resolve, reject) => {
                if (Object.keys(req.body).length > 0) {
                    console.log(req.body)
                    newSubmission = {};
                    newSubmission.id = uuidv4();
                    newSubmission.assignment_id = assignmentId;
                    newSubmission.submission_url = submission_url;
                    try {
                        await Submission.create(newSubmission);
                    } catch (err) {
                        console.log(err)
                        logger.error(err.message, 'assignmentController: createSubmission', 10)
                        let apiResponse = response.generate(true, 'Failed to create new Submission', 400, null)
                        reject(apiResponse)
                    }
                    try {
                        const snsResponse = await publishToSNS(userEmail, submission_url, newSubmission.id, submissionDetails.length + 1, assignmentDetails.id);
                        console.log(snsResponse.MessageId);
                        logger.info(snsResponse.MessageId, "assignmentController: createSubmission", 1);
                        resolve(newSubmission);
                    }
                    catch (err) {
                        logger.error("Issue in SNS Delivery: " + err, "assignmentController: createSubmission", 10);
                        resolve(newSubmission);
                    }
                } else {
                    logger.error('Body Not Present', 'assignmentController: createSubmission', 4)
                    let apiResponse = response.generate(true, "Body not present", 400, null)
                    reject(apiResponse)
                }
            })
        }



        createSubmission(req, res)
            .then((resolve) => {
                logger.info("Submission Created", "Assignment Controller: createSubmission", 5);
                let apiResponse = response.generate(false, 'Submission Created', 201, resolve);
                res.status(apiResponse.status).send(resolve);
            })
            .catch((err) => {
                console.log(err);
                logger.error(err, "Assignment Controller: createSubmission", 5);
                res.status(err.status ? err.status : 400).send();
            })
    } else {
        logger.info('No Assignment Found', 'Assignment Controller:createSubmission')
        let apiResponse = response.generate(true, 'No Assignment Found', 404, null);
        res.status(apiResponse.status).send();
        return;
    }

}

const updateAssignment = async (req, res) => {
    client.increment('updateAssignments');
    let assignmentDetails;
    let assignmentId;
    let updatedDetails;
    let userEmail = userAuthentication.getUserEmail(req, res);
    if (req.headers['content-type'] !== 'application/json' && req.headers['content-length'] == 0) {
        logger.error("Body Expected", "Assignment Controller: updateAssignments", 5);
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    }
    if (typeof req.query == 'object' && Object.keys(req.query).length !== 0 && Object.values(req.query).length !== 0) {
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
                logger.error("Points are not in range to update", "Assignment Controller: updateAssignments", 5);
                let apiResponse = response.generate(true, 'Points are not in range for assignment', 400, null)
                res.status(apiResponse.status).send();
                return;
            }
        }
    });
    if (req.params.id) {
        assignmentId = req.params.id;
    } else {
        logger.error("Missing ID Parameter", "Assignment Controller: updateAssignments", 5);
        let apiResponse = response.generate(true, 'Missing ID Parameter', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    try {
        assignmentDetails = await Assignment.findOne({ where: { id: assignmentId } });
    } catch (err) {
        logger.error(err.message, 'Assignment Controller: editAssignment', 10);
        let apiResponse = response.generate(true, 'Failed to find Assignment Details', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (!check.isEmpty(assignmentDetails)) {
        if (userEmail == assignmentDetails.userId) {
            try {
                updatedDetails = await Assignment.update(req.body, { where: { id: req.params.id } });
            } catch (err) {
                logger.error(err.message, 'Assignment Controller:editAssignment', 10)
                let apiResponse = response.generate(true, 'Failed to update Assignment', 400, null)
                res.status(apiResponse.status).send();
                return;
            }
        } else {
            logger.error('No Permissions for this user to edit this assignment', 'Assignment Controller:editAssignment', 10)
            let apiResponse = response.generate(true, 'No Permissions for this user to edit this assignment', 403, null);
            res.status(apiResponse.status).send();
            return;
        }
        logger.info("Assignment Details Updated", 'Assignment Controller: editAssignment', 10);
        let apiResponse = response.generate(false, 'Assignment Details Updated', 204, updatedDetails);
        res.status(apiResponse.status).send();
        return;
    } else {
        logger.info('No Assignment Found', 'Assignment Controller:editAssignment')
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
        logger.error("No Body Expected", 'Assignment Controller: deleteAssignment', 10);
        let apiResponse = response.generate(true, 'No Body Expected', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (typeof req.query == 'object' && Object.keys(req.query).length !== 0 && Object.values(req.query).length !== 0) {
        res.status(400).setHeader('cache-control', 'no-cache').send();
        return;
    }
    if (req.params.id) {
        assignmentId = req.params.id;
    } else {
        logger.error("Missing ID Parameter", 'Assignment Controller: deleteAssignment', 10);
        let apiResponse = response.generate(true, 'Missing ID Parameter', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    try {
        assignmentDetails = await Assignment.findOne({ where: { id: assignmentId } });
    } catch (err) {
        logger.error(err.message, 'Assignment Controller: deleteAssignment', 10);
        let apiResponse = response.generate(true, 'Failed to find Assignment Details', 400, null);
        res.status(apiResponse.status).send();
        return;
    }
    if (!check.isEmpty(assignmentDetails)) {
        if (userEmail == assignmentDetails.userId) {
            try {
                await Assignment.destroy({ where: { id: req.params.id } });
            } catch (err) {
                logger.error(err.message, 'Assignment Controller: deleteAssignment', 10);
                let apiResponse = response.generate(true, 'Failed to delete Assignment', 400, null)
                res.status(apiResponse.status).send();
                return;
            }
        } else {
            logger.error('No Permissions for this user to delete this assignment', 'Assignment Controller: deleteAssignment', 10);
            let apiResponse = response.generate(true, 'No Permissions for this user to delete this assignment', 403, null);
            res.status(apiResponse.status).send();
            return;
        }
        logger.error("Assignment Deleted", 'Assignment Controller: deleteAssignment', 10);
        let apiResponse = response.generate(false, 'Assignment Deleted', 204, null);
        res.status(apiResponse.status).send();
        return;
    } else {
        logger.info('No Assignment Found', 'Assignment Controller:deleteAssignment')
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
    deleteAssignment: deleteAssignment,
    createSubmission: submissionCreateFunction
}