import type { Subject, SubjectTarget } from '../domain/types';

export const subjects: Subject[] = [
  { id: 'chinese', name: '國文', shortName: '國', color: '#7655B7', lightColor: '#EEE8FB' },
  { id: 'english', name: '英文', shortName: '英', color: '#0B8E7C', lightColor: '#DDF5EE' },
  { id: 'math', name: '數學', shortName: '數', color: '#2E62CE', lightColor: '#E5EDFF' },
  { id: 'science', name: '自然', shortName: '自', color: '#B86B10', lightColor: '#FFF0DD' },
  { id: 'social', name: '社會', shortName: '社', color: '#C75C67', lightColor: '#FCE7E9' },
];

export const subjectTargets: SubjectTarget = {
  chinese: 180,
  english: 240,
  math: 360,
  science: 180,
  social: 150,
};

export function getSubject(subjectId: Subject['id']) {
  return subjects.find((subject) => subject.id === subjectId);
}
