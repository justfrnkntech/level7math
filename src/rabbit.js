import Phaser from 'phaser';

// A single scene owns the trail, rabbit, and all celebration animations.
export function rabbitGame(parent, { playing, completed, from = completed, onDance = () => {} }) {
  class RabbitTrail extends Phaser.Scene {
    create() {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.points = playing
        ? Array.from({ length: 7 }, (_, i) => ({ x: 48 + i * 57, y: 240 + Math.sin(i * 1.1) * 30 }))
        : Array.from({ length: 13 }, (_, i) => ({ x: i <= 6 ? 46 + i * 58 : 394 - (i - 6) * 58, y: i <= 6 ? 147 + Math.sin(i * .9) * 25 : 286 + Math.sin(i * .9) * 20 }));
      const g = this.add.graphics();
      g.fillStyle(0xece5fb); g.fillRoundedRect(10, 42, 420, 310, 80);
      g.fillStyle(0xd8d9f4); g.fillEllipse(220, 320, 390, 70);
      g.fillStyle(0xffd9a0); g.fillCircle(365, 70, 24);
      // Cloud puffs and tiny sakura petals frame the learning trail.
      g.fillStyle(0xffffff, .8);
      for (const [x,y] of [[72,72],[249,91]]) { g.fillRoundedRect(x-29,y,67,17,9); g.fillCircle(x-8,y,14); g.fillCircle(x+12,y-4,18); }
      g.fillStyle(0xf4bed6, .9);
      for (const [x,y] of [[32,203],[155,95],[287,331],[411,224],[210,310]]) { g.fillEllipse(x,y,9,5); g.fillEllipse(x+4,y-4,5,9); }
      g.fillStyle(0xffffff, .95);
      for (const [x,y] of [[125,213],[309,55],[362,324]]) { g.fillTriangle(x,y-7,x-3,y,x+3,y); g.fillTriangle(x,y+7,x-3,y,x+3,y); g.fillTriangle(x-7,y,x,y-3,x,y+3); g.fillTriangle(x+7,y,x,y-3,x,y+3); }
      g.lineStyle(22, 0xc8aedb, 1);
      g.beginPath(); this.points.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.strokePath();
      g.lineStyle(15, 0xffedf4, 1);
      g.beginPath(); this.points.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.strokePath();
      this.nodes = this.points.map((p, i) => {
        const milestone = !playing && i > 0 && i % 3 === 0;
        const node = this.add.circle(p.x, p.y, milestone ? 15 : 9, 0xffffff).setStrokeStyle(3, 0xbba1ce);
        if (milestone) this.add.text(p.x, p.y + 23, ['','Meadow','Bay','Woods','Castle'][i / 3], { fontFamily: 'Arial', fontSize: '11px', color: '#665081', backgroundColor: '#ece5fb' }).setOrigin(.5);
        return node;
      });
      this.add.text(220, 23, playing ? 'One happy hop for every answer' : 'Your bunny’s adventure trail', { fontFamily: 'Arial', fontSize: '18px', color: '#665081' }).setOrigin(.5);
      this.caption = this.add.text(220, 363, '', { fontFamily: 'Arial', fontSize: '16px', color: '#665081' }).setOrigin(.5);
      this.bunny = this.add.container(0, 0);
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
        this.tweens.add({ targets: p, x: Phaser.Math.Between(25, 415), y: 350, angle: 240, alpha: 0, duration: 1500, onComplete: () => p.destroy() });
      }
    }
  }
  return new Phaser.Game({ type: Phaser.AUTO, width: 440, height: 390, parent, transparent: true, scene: RabbitTrail, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, audio: { noAudio: true }, banner: false });
}
