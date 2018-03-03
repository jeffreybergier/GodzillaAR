const Scene = require('Scene');
const Reactive = require('Reactive');
const TouchGestures = require('TouchGestures')
const Log = require('Diagnostics');
const Animation = require('Animation');

var mug_ctrl = Scene.root.find('mug_controller');
var planeTracker = Scene.root.find('planeTracker0');
var laserBeam = Scene.root.find('laser_beam');

TouchGestures.onTap().subscribe(function(gesture) {
	laserBeam.birthrate = 0;
	
	var test_location = planeTracker.hitTest(gesture.location);
	var last_loc_x = mug_ctrl.transform.x.lastValue;
	var last_loc_y = mug_ctrl.transform.y.lastValue;
	var last_loc_z = mug_ctrl.transform.z.lastValue;

	var animator = Animation.timeDriver({durationMilliseconds: 1000, loopCount: 1});
	var xSampler = Animation.samplers.linear(last_loc_x, test_location.x);
	var ySampler = Animation.samplers.linear(last_loc_y, test_location.y);
	var zSampler = Animation.samplers.linear(last_loc_z, test_location.z);

	mug_ctrl.transform.x = Animation.animate(animator, xSampler);
	mug_ctrl.transform.y = Animation.animate(animator, ySampler);
	mug_ctrl.transform.z = Animation.animate(animator, zSampler);
	
	var completion = animator.onCompleted();
	completion.subscribe(function() {
		laserBeam.birthrate = 200;
	});
	
	animator.start();
});

TouchGestures.onPan(planeTracker).subscribe(function(gesture) {
	planeTracker.trackPoint(gesture.location, gesture.state);
});

TouchGestures.onPinch().subscribe(function(gesture) {
	var lastScaleX = mug_ctrl.transform.scaleX.lastValue;
	mug_ctrl.transform.scaleX = Reactive.mul(lastScaleX, gesture.scale);

	var lastScaleY = mug_ctrl.transform.scaleY.lastValue;
	mug_ctrl.transform.scaleY = Reactive.mul(lastScaleY, gesture.scale);

	var lastScaleZ = mug_ctrl.transform.scaleZ.lastValue;
	mug_ctrl.transform.scaleZ = Reactive.mul(lastScaleZ, gesture.scale);
});

TouchGestures.onRotate(mug_ctrl).subscribe(function(gesture) {
  var lastRotationY = mug_ctrl.transform.rotationY.lastValue;
  mug_ctrl.transform.rotationY = Reactive.add(lastRotationY, Reactive.mul(-1, gesture.rotation));
});
