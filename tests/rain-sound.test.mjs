import test from 'node:test';
import assert from 'node:assert/strict';
import {GLYPHS,RAIN,columnCount,trailLength,graphemeCount,createColumns,shouldPause} from '../rain.js';
import {isMuted,setMuted,play,onSound,SOUND_EVENTS} from '../sounds.js';
test('rain is denser and keeps its colours',()=>{
 assert.ok(RAIN.columnPitch<30);
 assert.ok(RAIN.glyphGap<25);
 assert.ok(RAIN.fontSize<20);
 assert.equal(RAIN.head,'#d9ffc3');
 assert.equal(RAIN.body,'#83c79d');
 assert.ok(columnCount(1440)>Math.ceil(1440/44));
 assert.ok(trailLength(800)>10);
 const columns=createColumns(360,400);
 assert.equal(columns.length,columnCount(360));
 assert.equal(columns[0].glyphs.length,trailLength(400));
 assert.ok(columns[0].glyphs.every(glyph=>GLYPHS.includes(glyph)));
});
test('sanskrit glyphs stay whole clusters',()=>{
 assert.ok(GLYPHS.includes('क्ष')&&GLYPHS.includes('श्री')&&GLYPHS.includes('ज्ञ'));
 assert.equal(GLYPHS.includes('्'),false);
 for(const glyph of GLYPHS) assert.equal(graphemeCount(glyph),1,glyph);
});
test('reduced motion still starts paused',()=>{
 assert.equal(shouldPause(true),true);
 assert.equal(shouldPause(false),false);
});
test('sounds cover the named events and honour mute',()=>{
 setMuted(false);
 assert.equal(isMuted(),false);
 assert.deepEqual(SOUND_EVENTS,['input','result','language','reset']);
 const heard=[];
 const stop=onSound(name=>heard.push(name));
 assert.equal(play('input'),true);
 assert.equal(play('result'),true);
 assert.equal(play('language'),true);
 assert.equal(play('reset'),true);
 setMuted(true);
 assert.equal(isMuted(),true);
 assert.equal(play('input'),false);
 assert.deepEqual(heard,['input','result','language','reset']);
 setMuted(false);
 assert.equal(play('nope'),false);
 stop();
});
