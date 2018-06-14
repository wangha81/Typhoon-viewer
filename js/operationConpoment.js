export default function (field, btns = null, card = null, btnClass = null) {
    this.field = document.getElementById(field);
    this.triggerValue = null;
    this.btns = btns;
    this.exts = [].map.call(document.getElementsByClassName(btns), (e) => {
        return e;
    });
    this.card = [].map.call(document.getElementsByClassName(card), (e) => {
        return e;
    });
    this.btn = [].map.call(document.getElementsByClassName(btnClass), (e) => {
        return e;
    });
    this.length = this.btn.length;
    this.nowPage = 0;
    this.init = () => {
        this.field.style.left = "-20vw";
        this.triggerValue = false;
        if (this.btns != null) {
            this.exts.forEach(e => {
                e.style.opacity = 0;
                e.style.width = '4vw';
                e.style.left = '-10vw';
            });
        }

        for (let p = 0; p < this.length; p++) {
            this.btn[p].value = p;
            this.card[p].style.left = "-20vw";
        }
    }
    this.click = () => {
        if (this.triggerValue) {
            this.triggerValue = false;
            this.off();
        } else {
            this.triggerValue = true;
            this.on();
        }
    }
    this.on = () => {
        this.field.style.left = '0vw';
        this.exts.forEach(element => {});
        this.exts.forEach(e => {
            e.style.opacity = 1;
            e.style.left = '-0vw';
        });

        this.card[this.nowPage].style.left = "0vw";
    }
    this.off = () => {
        this.field.style.left = '-20vw';
        this.exts.forEach(element => {});
        this.exts.forEach(e => {
            e.style.opacity = 0;
            e.style.left = '-10vw';
        });

        this.card[this.nowPage].style.left = "-20vw";
    }
    this.SwitchPage = (n, log=false) => {
        if (n == this.nowPage) return true;
        if (this.triggerValue) {
            this.card[this.nowPage].style.left = "-20vw";
            this.card[n].style.left = "0vw";
        }
        this.nowPage = n;
    }
    this.init();
}