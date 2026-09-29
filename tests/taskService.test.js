const service = require('../src/services/taskService');

beforeEach(() => service._reset());
const make = (overrides = {}) => service.create({ title: 'Task', ...overrides });

test('create applies defaults and returns stored task', () => {
  const t = make();
  expect(t).toMatchObject({ title: 'Task', description: '', status: 'todo', priority: 'medium', dueDate: null, completedAt: null });
  expect(service.findById(t.id)).toEqual(t);
  expect(t.createdAt).toBeTruthy();
});
test('getAll returns a copy of the collection', () => { make(); const all = service.getAll(); all.pop(); expect(service.getAll()).toHaveLength(1); });
test('findById returns undefined for missing ID', () => expect(service.findById('missing')).toBeUndefined());
test('getByStatus filters exact status', () => { make({status:'todo'}); make({status:'done'}); expect(service.getByStatus('done')).toHaveLength(1); });
test('pagination uses one-based pages', () => { make(); make(); make(); expect(service.getPaginated(1,2)).toHaveLength(2); expect(service.getPaginated(2,2)).toHaveLength(1); });
test('stats counts statuses and overdue unfinished tasks', () => { make({status:'todo',dueDate:'2000-01-01'}); make({status:'done',dueDate:'2000-01-01'}); expect(service.getStats()).toEqual({todo:1,in_progress:0,done:1,overdue:1}); });
test('update changes fields and missing returns null', () => { const t=make(); expect(service.update(t.id,{title:'Changed'}).title).toBe('Changed'); expect(service.update('x',{})).toBeNull(); });
test('remove returns boolean and removes task', () => { const t=make(); expect(service.remove(t.id)).toBe(true); expect(service.findById(t.id)).toBeUndefined(); expect(service.remove(t.id)).toBe(false); });
test('complete sets done and completion timestamp without changing priority', () => { const t=make({priority:'high'}); const done=service.completeTask(t.id); expect(done.status).toBe('done'); expect(done.priority).toBe('high'); expect(done.completedAt).toBeTruthy(); expect(service.completeTask('x')).toBeNull(); });
test('assign stores assignee', () => { const t=make(); expect(service.assign(t.id,'Vishal').assignee).toBe('Vishal'); });
