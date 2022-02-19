/* eslint-disable no-console */
export default function assignDistrict(postalCode) {
  const digitsArr = postalCode.split('');
  const districtNum = digitsArr[0] + digitsArr[1];

  switch (districtNum) {
    case '01':
    case '02':
    case '03':
    case '04':
    case '05':
    case '06':
      return 'Raffles Place';
    case '07':
    case '08':
      return 'Tanjong Pagar';
    case '14':
    case '15':
    case '16':
      return 'Queenstown';
    case '09':
    case '10':
      return 'Telok Blangah';
    case '11':
    case '12':
    case '13':
      return 'Pasir Panjang';
    case '17':
      return 'Beach Road';
    case '18':
    case '19':
      return 'Golden Mile';
    case '20':
    case '21':
      return 'Little Indea';
    case '22':
    case '23':
      return 'Orchard';
    case '24':
    case '25':
    case '26':
    case '27':
      return 'Bukit Timah';
    case '28':
    case '29':
    case '30':
      return 'Novena';
    case '31':
    case '32':
    case '33':
      return 'Toa Payoh';
    case '34':
    case '35':
    case '36':
    case '37':
      return 'Macpherson';
    case '38':
    case '39':
    case '40':
    case '41':
      return 'Geylang';
    case '42':
    case '43':
    case '44':
    case '45':
      return 'Katong';
    case '46':
    case '47':
    case '48':
      return 'Bedok';
    case '49':
    case '50':
    case '81':
      return 'Changi';
    case '51':
    case '52':
      return 'Tampines';
    case '53':
    case '54':
    case '55':
    case '82':
      return 'Punggol';
    case '56':
    case '57':
      return 'Bishan';
    case '58':
    case '59':
      return 'Upper Bukit Timah';
    case '60':
    case '61':
    case '62':
    case '63':
    case '64':
      return 'Jurong';
    case '65':
    case '66':
    case '67':
    case '68':
      return 'Choa Chu Kang';
    case '69':
    case '70':
    case '71':
      return 'Lim Chu Kang';
    case '72':
    case '73':
      return 'Kranji';
    case '77':
    case '78':
      return 'Upper Thomson';
    case '75':
    case '76':
      return 'Yishun';
    case '79':
    case '80':
      return 'Seletar';
    default:
      return 'Nil';
  }
}
