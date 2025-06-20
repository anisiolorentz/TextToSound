export class Volume {
    static currentVolume = 0.5; // em gain (de 0 a 1)

    static up() {
        this.currentVolume += 0.1;
        this.currentVolume = Math.min(this.currentVolume, 1); 
        this.updateVolumeDisplay();
        console.log(`Volume aumentado para: ${this.currentVolume}`);
    }

    static down() {
        this.currentVolume -= 0.1;
        this.currentVolume = Math.max(this.currentVolume, 0.0);
        this.updateVolumeDisplay();
        console.log(`Volume diminuído para: ${this.currentVolume}`);
    }

    static double() {
        if (this.currentVolume === 0.0) {
            this.currentVolume = 0.0625;
        }
        this.currentVolume = Math.min(this.currentVolume * 2, 1.0);
        this.updateVolumeDisplay();
        console.log(`Volume dobrado para: ${this.currentVolume}dB`);
    }

    static default() {
        this.currentVolume = 0.50;
        this.updateVolumeDisplay();
    }
    
    static getCurrentVolume() {
        return this.currentVolume;
    }

    static updateVolumeDisplay() {
        const volumeValue = document.querySelector(".volume-value");
        if (volumeValue) {
            const percentage = Math.round(Volume.getCurrentVolume() * 100);
            volumeValue.innerHTML = `${percentage}%`;
        }
    }
}