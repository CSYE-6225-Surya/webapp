import assignmentController from '../controllers/assignmentController';
import userAuthentication from '../middlewares/userAuthentication';
import healthController from '../controllers/healthController';
import identifyRoute from '../middlewares/routeIdentifier';

let version = '/v2';
let baseUrl = `${version}/assignments`;

export default (app) => {
    app.get(baseUrl, userAuthentication.authenticate, assignmentController.getAllAssignments);
    app.get(`${baseUrl}/:id`, userAuthentication.authenticate, assignmentController.getAssignmentById);
    app.post(baseUrl, userAuthentication.authenticate, assignmentController.createAssignment);
    app.put(`${baseUrl}/:id`, userAuthentication.authenticate, assignmentController.updateAssignment);
    app.delete(`${baseUrl}/:id`, userAuthentication.authenticate, assignmentController.deleteAssignment);
    app.post(`${baseUrl}/:id/submission`, userAuthentication.authenticate, assignmentController.createSubmission);
    app.get('/healthz', identifyRoute, healthController.getHealth);
}