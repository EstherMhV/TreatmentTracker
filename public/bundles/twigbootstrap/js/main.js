class TwigBootstrapBundle {
  collapse() {
    document.querySelector('body.twigbootstrap').classList.add("sidebar-collapse");
  }

  expand() {
    document.querySelector('body.twigbootstrap').classList.remove("sidebar-collapse");
  }
}

TwigBootstrapBundle = new TwigBootstrapBundle();
