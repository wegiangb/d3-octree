var tape = require("tape"),
    d3_octree = require("../");

tape("octree.add(datum) creates a new point and adds it to the octree", function(test) {
  var q = d3_octree.octree();
  test.deepEqual(q.add([0, 0, 0]).root(), {data: [0, 0, 0]});
  test.deepEqual(q.add([1, 1, 1]).root(), [{data: [0, 0, 0]},,,,,,, {data: [1, 1, 1]}]);
  test.deepEqual(q.add([1, 0, 0]).root(), [{data: [0, 0, 0]}, {data: [1, 0, 0]},,,,,, {data: [1, 1, 1]}]);
  test.deepEqual(q.add([0, 1, 0]).root(), [{data: [0, 0, 0]}, {data: [1, 0, 0]}, {data: [0, 1, 0]},,,,, {data: [1, 1, 1]}]);
  test.deepEqual(q.add([0, 0, 1]).root(), [{data: [0, 0, 0]}, {data: [1, 0, 0]}, {data: [0, 1, 0]},, {data: [0, 0, 1]},,, {data: [1, 1, 1]}]);
  test.deepEqual(q.add([0.4, 0.4, 0.4]).root(), [[{data: [0, 0, 0]},,,,,,, {data: [0.4, 0.4, 0.4]}], {data: [1, 0, 0]}, {data: [0, 1, 0]},, {data: [0, 0, 1]},,, {data: [1, 1, 1]}]);
  test.end();
});

tape("octree.add(datum) handles points being on the perimeter of the octree bounds", function(test) {
  var q = d3_octree.octree().extent([[0, 0, 0], [1, 1, 1]]);
  test.deepEqual(q.add([0, 0, 0]).root(), {data: [0, 0, 0]});
  test.deepEqual(q.add([1, 1, 1]).root(), [{data: [0, 0, 0]},,,,,,, {data: [1, 1, 1]}]);
  test.deepEqual(q.add([1, 0, 0]).root(), [{data: [0, 0, 0]}, {data: [1, 0, 0]},,,,,, {data: [1, 1, 1]}]);
  test.deepEqual(q.add([0, 1, 0]).root(), [{data: [0, 0, 0]}, {data: [1, 0, 0]}, {data: [0, 1, 0]},,,,, {data: [1, 1, 1]}]);
  test.deepEqual(q.add([0, 0, 1]).root(), [{data: [0, 0, 0]}, {data: [1, 0, 0]}, {data: [0, 1, 0]},, {data: [0, 0, 1]},,, {data: [1, 1, 1]}]);
  test.end();
});

tape("octree.add(datum) handles points being to the left of the octree bounds", function(test) {
  var q = d3_octree.octree().extent([[0, 0, 0], [2, 2, 2]]);
  test.deepEqual(q.add([-1, 1, 1]).extent(), [[-2, 0, 0], [2, 4, 4]]);
  test.end();
});

tape("octree.add(datum) handles points being to the right of the octree bounds", function(test) {
  var q = d3_octree.octree().extent([[0, 0, 0], [2, 2, 2]]);
  test.deepEqual(q.add([3, 1, 1]).extent(), [[0, 0, 0], [4, 4, 4]]);
  test.end();
});

tape("octree.add(datum) handles points being to the top of the octree bounds", function(test) {
  var q = d3_octree.octree().extent([[0, 0, 0], [2, 2, 2]]);
  test.deepEqual(q.add([1, -1, 1]).extent(), [[0, -2, 0], [4, 2, 4]]);
  test.end();
});

tape("octree.add(datum) handles points being to the bottom of the octree bounds", function(test) {
  var q = d3_octree.octree().extent([[0, 0, 0], [2, 2, 2]]);
  test.deepEqual(q.add([1, 3, 1]).extent(), [[0, 0, 0], [4, 4, 4]]);
  test.end();
});

tape("octree.add(datum) handles points being to the front of the octree bounds", function(test) {
  var q = d3_octree.octree().extent([[0, 0, 0], [2, 2, 2]]);
  test.deepEqual(q.add([1, 1, -1]).extent(), [[0, 0, -2], [4, 4, 2]]);
  test.end();
});

tape("octree.add(datum) handles points being to the back of the octree bounds", function(test) {
  var q = d3_octree.octree().extent([[0, 0, 0], [2, 2, 2]]);
  test.deepEqual(q.add([1, 1, 3]).extent(), [[0, 0, 0], [4, 4, 4]]);
  test.end();
});

tape("octree.add(datum) handles coincident points by creating a linked list", function(test) {
  var q = d3_octree.octree().extent([[0, 0, 0], [1, 1, 1]]);
  test.deepEqual(q.add([0, 0, 0]).root(), {data: [0, 0, 0]});
  test.deepEqual(q.add([1, 0, 0]).root(), [{data: [0, 0, 0]}, {data: [1, 0, 0]},,,,,, ]);
  test.deepEqual(q.add([0, 1, 0]).root(), [{data: [0, 0, 0]}, {data: [1, 0, 0]}, {data: [0, 1, 0]},,,,, ]);
  test.deepEqual(q.add([0, 1, 0]).root(), [{data: [0, 0, 0]}, {data: [1, 0, 0]}, {data: [0, 1, 0], next: {data: [0, 1, 0]}},,,,, ]);
  test.end();
});

tape("octree.add(datum) implicitly defines trivial bounds for the first point", function(test) {
  var q = d3_octree.octree().add([1, 2, 3]);
  test.deepEqual(q.extent(), [[1, 2, 3], [2, 3, 4]]);
  test.deepEqual(q.root(), {data: [1, 2, 3]});
  test.end();
});
