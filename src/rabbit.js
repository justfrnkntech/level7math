import Phaser from 'phaser';

// A single scene owns the trail, rabbit, and all celebration animations.
export function rabbitGame(parent, { playing, completed, from = completed, onDance = () => {} }) {
  class RabbitTrail extends Phaser.Scene {
    create() {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const steps = playing ? 6 : 12;
      this.points = Array.from({ length: steps + 1 }, (_, i) => ({ x: 55 + i / steps * 296, y: 239 - Math.sin(i / steps * Math.PI) * 6 }));
      const g = this.add.graphics();
      // An open meadow and a little home tucked into the hill.
      g.fillStyle(0xece5fb, .55); g.fillEllipse(220, 160, 420, 200);
      g.fillStyle(0xffd9a0); g.fillCircle(365, 64, 21);
      g.fillStyle(0xffffff, .85);
      for (const [x,y] of [[78,77],[224,56]]) { g.fillRoundedRect(x-24,y,57,14,7); g.fillCircle(x-7,y,11); g.fillCircle(x+10,y-3,15); }
      g.fillStyle(0xd7e7d8); g.fillEllipse(289, 223, 278, 173);
      g.fillStyle(0xc1d9c8); g.fillEllipse(310, 245, 233, 92);
      g.fillStyle(0xe1e8d9); g.fillEllipse(220, 256, 420, 56);
      // Soft earthen arch, warm wooden door, and a round glowing window.
      g.fillStyle(0xc2a4bd); g.fillRoundedRect(318,174,69,79,{tl:34,tr:34,bl:8,br:8});
      g.fillStyle(0x76596f); g.fillRoundedRect(325,181,55,69,{tl:27,tr:27,bl:5,br:5});
      g.fillStyle(0xb4899e); g.fillRoundedRect(329,185,47,62,{tl:23,tr:23,bl:4,br:4});
      g.lineStyle(1,0x98748d); g.lineBetween(342,191,342,245); g.lineBetween(355,187,355,245); g.lineBetween(367,192,367,245);
      g.fillStyle(0xffe2a8); g.fillCircle(352,204,10); g.lineStyle(2,0x76596f); g.strokeCircle(352,204,10); g.lineBetween(342,204,362,204); g.lineBetween(352,194,352,214);
      g.fillStyle(0xffd995); g.fillCircle(367,229,3);
      g.fillStyle(0xd0b9cc); g.fillEllipse(352,252,72,11);
      // Meadow flowers quietly show completed hops, without a separate track.
      this.nodes = this.points.map((p,i) => {
        g.lineStyle(1,0x94b59c); g.lineBetween(p.x,260,p.x,267);
        return this.add.circle(p.x,259,playing ? 3 : 2.5,0xffffff);
      });
      for (const [x,y] of [[199,207],[268,161],[404,224],[111,244]]) {
        g.fillStyle(0xeeb7d0); g.fillCircle(x-3,y,3); g.fillCircle(x+3,y,3); g.fillCircle(x,y-3,3); g.fillCircle(x,y+3,3);
        g.fillStyle(0xffe2a8); g.fillCircle(x,y,2);
      }
      this.add.text(220, 20, playing ? 'Hop home to your cozy burrow' : 'A little closer to home with every lesson', { fontFamily: 'Arial', fontSize: '16px', color: '#665081' }).setOrigin(.5);
      this.caption = this.add.text(220, 288, '', { fontFamily: 'Arial', fontSize: '14px', color: '#665081' }).setOrigin(.5);
      this.bunny = this.add.container(0, 0).setScale(.78);
      const body = this.add.graphics();
      // Chibi proportions: a large plush head over a tiny pear-shaped body.
      body.fillStyle(0xd7c9e3, .65); body.fillEllipse(0, 4, 56, 11);
      body.lineStyle(2, 0xc9b7dc);
      body.fillStyle(0xfffbff); body.fillCircle(24, -15, 10); body.strokeCircle(24, -15, 10);
      body.fillEllipse(0, -17, 34, 35); body.strokeEllipse(0, -17, 34, 35);
      body.fillStyle(0xeee5fa); body.fillEllipse(0, -13, 19, 20);
      body.fillStyle(0xfffbff);
      body.fillEllipse(-12, 0, 19, 11); body.strokeEllipse(-12, 0, 19, 11);
      body.fillEllipse(12, 0, 19, 11); body.strokeEllipse(12, 0, 19, 11);
      body.fillEllipse(-19, -21, 13, 18); body.strokeEllipse(-19, -21, 13, 18);
      body.fillEllipse(19, -21, 13, 18); body.strokeEllipse(19, -21, 13, 18);
      // Rounded ears stay inside the existing animation footprint.
      body.fillEllipse(-18, -85, 20, 45); body.strokeEllipse(-18, -85, 20, 45);
      body.fillEllipse(18, -83, 22, 41); body.strokeEllipse(18, -83, 22, 41);
      body.fillStyle(0xf5bdd8); body.fillEllipse(-18, -87, 10, 30); body.fillEllipse(18, -85, 12, 26);
      body.fillStyle(0xfffbff); body.fillEllipse(0, -52, 76, 63); body.strokeEllipse(0, -52, 76, 63);
      body.fillStyle(0xf4b6d0); body.fillEllipse(-26, -43, 16, 10); body.fillEllipse(26, -43, 16, 10);
      body.fillStyle(0xffffff, .8); body.fillEllipse(-28, -45, 5, 2); body.fillEllipse(24, -45, 5, 2);
      body.fillStyle(0xa580d0); body.fillRoundedRect(-17, -25, 34, 7, 3);
      body.fillTriangle(11, -20, 22, -7, 8, -10);
      // A tiny sakura clip and scarf charm complete the pastel outfit.
      body.fillStyle(0xf0a7cc);
      for (let i=0;i<5;i++) { const angle=i*Math.PI*2/5; body.fillCircle(27+Math.cos(angle)*4,-72+Math.sin(angle)*4,3.5); }
      body.fillStyle(0xffdc92); body.fillCircle(27,-72,2.5); body.fillCircle(0,-21,3);
      this.face = this.add.graphics(); this.bunny.add([body, this.face]);
      this.index = playing ? 0 : Math.min(from, 12);
      this.bunny.setPosition(this.points[this.index].x, this.points[this.index].y - 8);
      this.paintFace(false); this.paintProgress(this.index);
      this.events.on('answer', index => { this.paintFace(true); this.hopTo(index); });
      this.events.on('neutral', () => this.paintFace(false));
      this.events.on('finish', () => { this.finishPending = true; if (!this.moving) this.dance(); });
      if (!playing && from < completed) this.hopTo(completed);
    }
    paintFace(happy) {
      const g = this.face; g.clear(); g.lineStyle(3, 0x514060);
      if (happy) {
        for (const x of [-15, 15]) { g.beginPath(); g.arc(x, -52, 7, Math.PI, Math.PI * 2); g.strokePath(); }
        g.fillStyle(0x69435e); g.fillEllipse(0, -39, 14, 13);
        g.fillStyle(0xf19dbc); g.fillEllipse(0, -36, 9, 5);
        g.fillStyle(0xffffff); g.fillRoundedRect(-3, -45, 6, 5, 1);
      } else {
        for (const x of [-15,15]) {
          g.fillStyle(0x514060); g.fillEllipse(x,-53,14,20);
          g.fillStyle(0xa28bcf); g.fillEllipse(x,-48,9,7);
          g.fillStyle(0xffffff); g.fillCircle(x-2,-57,3.5); g.fillCircle(x+3,-51,1.8);
        }
        g.lineStyle(2,0x69435e);
        for (const x of [-3,3]) { g.beginPath(); g.arc(x,-40,3,0,Math.PI); g.strokePath(); }
      }
      g.fillStyle(0xe79aae); g.fillTriangle(-3, -45, 3, -45, 0, -42);
    }

    paintProgress(index) {
      this.nodes.forEach((n, i) => n.setFillStyle(i <= index ? 0xd49cbe : 0xffffff));
      this.caption.setText(playing ? `${index} of 6 happy hops` : `${index} of 12 lessons explored`);
    }
    hopTo(target) {
      // Finish the current hop before dancing, even if Next is pressed quickly.
      this.hopTween?.remove();
      this.tweens.killTweensOf(this.bunny);
      this.moving = true;
      const next = Math.min(this.index + 1, target), p = this.points[next];
      const land = () => {
        this.index = next; this.paintProgress(next);
        if (next < target) this.hopTo(target);
        else { this.moving = false; if (this.finishPending) this.dance(); }
      };
      if (this.reduced) { this.bunny.setPosition(p.x, p.y - 8); land(); return; }
      const startX = this.bunny.x, startY = this.bunny.y;
      this.hopTween = this.tweens.addCounter({ from: 0, to: 1, duration: 480, ease: 'Sine.easeInOut', onUpdate: t => {
        const v = t.getValue(); this.bunny.setPosition(startX + (p.x - startX) * v, startY + (p.y - 8 - startY) * v - Math.sin(v * Math.PI) * 42);
      }, onComplete: land });
    }
    dance() {
      this.finishPending = false; this.paintFace(true);
      const milestone = (completed + 1) % 3 === 0;
      onDance(milestone);
      this.caption.setText(milestone ? 'World complete! A big bunny hooray!' : 'You did it! Time for a bunny dance!');
      if (this.reduced) return;
      this.tweens.add({ targets: this.bunny, angle: { from: -13, to: 13 }, duration: 170, yoyo: true, repeat: 7, onComplete: () => this.bunny.setAngle(0) });
      this.tweens.add({ targets: this.bunny, y: this.bunny.y - 22, duration: 170, yoyo: true, repeat: 7 });
      for (let i = 0; i < (milestone ? 50 : 25); i++) {
        const p = this.add.rectangle(this.bunny.x, this.bunny.y - 60, 7, 10, Phaser.Utils.Array.GetRandom([0xf1bf54, 0x91c7df, 0xeaa8c0, 0x8f83c5]));
        this.tweens.add({ targets: p, x: Phaser.Math.Between(25, 415), y: 265, angle: 240, alpha: 0, duration: 1500, onComplete: () => p.destroy() });
      }
    }
  }
  return new Phaser.Game({ type: Phaser.AUTO, width: 440, height: 310, parent, transparent: true, scene: RabbitTrail, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, audio: { noAudio: true }, banner: false });
}
