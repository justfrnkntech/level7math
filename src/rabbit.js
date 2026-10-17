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
      g.fillStyle(0xe8f0db); g.fillRoundedRect(10, 42, 420, 310, 80);
      g.fillStyle(0xd9e8c7); g.fillEllipse(220, 320, 390, 70);
      g.fillStyle(0xffd579); g.fillCircle(365, 70, 24);
      g.lineStyle(22, 0xd7c6a2, 1);
      g.beginPath(); this.points.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.strokePath();
      g.lineStyle(15, 0xf8edd2, 1);
      g.beginPath(); this.points.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.strokePath();
      this.nodes = this.points.map((p, i) => {
        const milestone = !playing && i > 0 && i % 3 === 0;
        const node = this.add.circle(p.x, p.y, milestone ? 15 : 9, 0xffffff).setStrokeStyle(3, 0xb7c69b);
        if (milestone) this.add.text(p.x, p.y + 23, ['','Meadow','Bay','Woods','Castle'][i / 3], { fontFamily: 'Arial', fontSize: '11px', color: '#526a3f', backgroundColor: '#e8f0db' }).setOrigin(.5);
        return node;
      });
      this.add.text(220, 23, playing ? 'One happy hop for every answer' : 'Your bunny’s adventure trail', { fontFamily: 'Arial', fontSize: '18px', color: '#476438' }).setOrigin(.5);
      this.caption = this.add.text(220, 363, '', { fontFamily: 'Arial', fontSize: '16px', color: '#476438' }).setOrigin(.5);
      this.bunny = this.add.container(0, 0);
      const body = this.add.graphics();
      // Long pink ears, soft white fur, paws, and a little green scarf.
      body.fillStyle(0xd5dacd); body.fillEllipse(0, 4, 54, 12);
      body.fillStyle(0xffffff); body.fillCircle(27, -19, 12);
      body.fillEllipse(-13, -85, 18, 53); body.fillEllipse(13, -85, 18, 53);
      body.fillStyle(0xf4bbca); body.fillEllipse(-13, -87, 8, 36); body.fillEllipse(13, -87, 8, 36);
      body.fillStyle(0xffffff); body.fillEllipse(0, -25, 48, 51); body.fillCircle(0, -57, 29);
      body.fillEllipse(-16, 0, 24, 12); body.fillEllipse(16, 0, 24, 12);
      body.fillStyle(0xeaf0e1); body.fillEllipse(0, -22, 27, 29);
      body.fillStyle(0x85ad58); body.fillRoundedRect(-22, -38, 44, 9, 4); body.fillTriangle(13, -34, 24, -15, 8, -17);
      body.fillStyle(0xf3becb); body.fillEllipse(-19, -52, 11, 7); body.fillEllipse(19, -52, 11, 7);
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
      const g = this.face; g.clear(); g.lineStyle(3, 0x344736);
      if (happy) {
        for (const x of [-10, 10]) { g.beginPath(); g.arc(x, -60, 5, Math.PI, Math.PI * 2); g.strokePath(); }
        g.fillStyle(0x69434b); g.fillEllipse(0, -46, 12, 10);
        g.fillStyle(0xffffff); g.fillRect(-3, -51, 6, 4);
      } else { g.fillStyle(0x344736); g.fillCircle(-10, -60, 3); g.fillCircle(10, -60, 3); g.lineBetween(-4, -46, 4, -46); }
      g.fillStyle(0xe79aae); g.fillTriangle(-4, -54, 4, -54, 0, -50);
    }
    paintProgress(index) {
      this.nodes.forEach((n, i) => n.setFillStyle(i <= index ? 0x93ba65 : 0xffffff));
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
        const p = this.add.rectangle(this.bunny.x, this.bunny.y - 60, 7, 10, Phaser.Utils.Array.GetRandom([0xf1bf54, 0x90b966, 0xeaa8c0, 0x8f83c5]));
        this.tweens.add({ targets: p, x: Phaser.Math.Between(25, 415), y: 350, angle: 240, alpha: 0, duration: 1500, onComplete: () => p.destroy() });
      }
    }
  }
  return new Phaser.Game({ type: Phaser.AUTO, width: 440, height: 390, parent, transparent: true, scene: RabbitTrail, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, audio: { noAudio: true }, banner: false });
}
