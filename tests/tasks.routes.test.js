const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/taskService');
beforeEach(() => service._reset());
const create = (body={title:'Task'}) => request(app).post('/tasks').send(body);

test('GET lists tasks and status filter', async()=>{ await create(); await create({title:'Done',status:'done'}); expect((await request(app).get('/tasks')).body).toHaveLength(2); expect((await request(app).get('/tasks?status=done')).body).toHaveLength(1); });
test('GET pagination is one based', async()=>{ await create(); await create(); expect((await request(app).get('/tasks?page=1&limit=1')).body).toHaveLength(1); });
test('GET stats reports counts', async()=>{ await create(); expect((await request(app).get('/tasks/stats')).body.todo).toBe(1); });
test('POST creates task; rejects invalid title/status/priority/date', async()=>{ expect((await create()).status).toBe(201); for (const body of [{},{title:' '},{title:'x',status:'bad'},{title:'x',priority:'bad'},{title:'x',dueDate:'bad'}]) expect((await create(body)).status).toBe(400); });
test('PUT updates and returns 404 for missing task', async()=>{ const t=(await create()).body; expect((await request(app).put(`/tasks/${t.id}`).send({title:'New'})).body.title).toBe('New'); expect((await request(app).put('/tasks/missing').send({title:'New'})).status).toBe(404); });
test('DELETE removes task and missing returns 404', async()=>{ const t=(await create()).body; expect((await request(app).delete(`/tasks/${t.id}`)).status).toBe(204); expect((await request(app).delete(`/tasks/${t.id}`)).status).toBe(404); });
test('PATCH complete marks task done and missing returns 404', async()=>{ const t=(await create()).body; expect((await request(app).patch(`/tasks/${t.id}/complete`)).body.status).toBe('done'); expect((await request(app).patch('/tasks/no/complete')).status).toBe(404); });
test('PATCH assign validates, assigns, and handles missing task', async()=>{ const t=(await create()).body; expect((await request(app).patch(`/tasks/${t.id}/assign`).send({assignee:'Vishal'})).body.assignee).toBe('Vishal'); expect((await request(app).patch(`/tasks/${t.id}/assign`).send({assignee:'   '})).status).toBe(400); expect((await request(app).patch('/tasks/no/assign').send({assignee:'A'})).status).toBe(404); });
test('PATCH assign rejects absent/non-string assignee', async()=>{ const t=(await create()).body; expect((await request(app).patch(`/tasks/${t.id}/assign`).send({})).status).toBe(400); expect((await request(app).patch(`/tasks/${t.id}/assign`).send({assignee:3})).status).toBe(400); });
