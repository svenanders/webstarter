const t = require('inferno-create-element');
import {Link} from 'inferno-router';
import Component from 'inferno-component';

export default class Sub extends Component {
  constructor(props) {
    super(props);
    this.allowClick = true;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.allowClick) {
      console.log('click', new Date());
    }
    this.allowClick = false;
    setTimeout(() => {
      this.allowClick = true;
    }, 750)
  }

  render() {
    return t('div', null,
      t('h2', null, 'My Sub Page'),
      t('div', null, 'Everything is A-OK!'),
      t('input', {type: 'button', onClick: this.handleClick, value: 'Klikk meg'}),
      t('div', null, t(Link, {to: '/'}, 'Take me back!')
      ));
  }


}
