import { FlattenedTree, Tree } from './tree'

export default {
  flattenedTree: {
    '0': [{ id: 10, title: 'House', level: 0, children: [], parent_id: null }],
    '1': [
      { id: 12, title: 'Red Roof', level: 1, children: [], parent_id: 10 },
      { id: 13, title: 'Wall', level: 1, children: [], parent_id: 10 },
      { id: 18, title: 'Blue Roof', level: 1, children: [], parent_id: 10 },
    ],
    '2': [
      { id: 15, title: 'Red Window', level: 2, children: [], parent_id: 12 },
      { id: 16, title: 'Door', level: 2, children: [], parent_id: 13 },
      { id: 17, title: 'Blue Window', level: 2, children: [], parent_id: 12 },
    ],
  } as FlattenedTree,
  inflatedTree: {
    id: 10,
    title: 'House',
    level: 0,
    parent_id: null,
    children: [
      {
        id: 12,
        title: 'Red Roof',
        level: 1,
        parent_id: 10,
        children: [
          {
            id: 15,
            title: 'Red Window',
            level: 2,
            children: [],
            parent_id: 12,
          },
          {
            id: 17,
            title: 'Blue Window',
            level: 2,
            children: [],
            parent_id: 12,
          },
        ],
      },
      {
        id: 13,
        title: 'Wall',
        level: 1,
        parent_id: 10,
        children: [
          { id: 16, title: 'Door', level: 2, children: [], parent_id: 13 },
        ],
      },
      {
        id: 18,
        title: 'Blue Roof',
        level: 1,
        parent_id: 10,
        children: [],
      },
    ],
  } as Tree,
}
