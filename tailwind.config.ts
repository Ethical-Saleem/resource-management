import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        custom: ['Inter'],
      },
      // backgroundImage: {
      //   'custom-401-gradient': "linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)",
      // },
      // backgroundImage: {
      //   'custom-gradient': 'linear-gradient(var(--tw-gradient-stops))',
      // },
      backgroundImage: {
        'agricultural-produce': 'linear-gradient(rgba(10, 191, 152, 0.5), rgba(3, 98, 82, 0.5)), url("/img/map_bg_3.PNG")',
        'energy-resource': 'linear-gradient(rgba(211, 133, 31, 0.5), rgba(118, 100, 24, 0.5)), url("/img/map_bg_3.PNG")',
        'solid-minerals': 'linear-gradient(rgba(252, 136, 19, 0.5), rgba(126, 54, 16, 0.5)), url("/img/map_bg_3.PNG")',
      },
      colors: {
        uigreen: {
          50: '#EBEFE7',
          100: '#D0FBEA',
          200: '#A4F6DA',
          300: '#6AEBC7',
          400: '#2FD8AE',
          500: '#0ABF98',
          600: '#009B7D',
          700: '#007C67',
          800: '#036252',
          900: '#045045',
          950: '#012D28'
        },
        uiearth: {
            50: '#FFF9ED',
            100: '#FFF1D4',
            200: '#FFDFA9',
            300: '#FFBF5D',
            400: '#FEA539',
            500: '#FC8813',
            600: '#ED6C09',
            700: '#C55209',
            800: '#9C4010',
            900: '#7E3610',
            950: '#441A06'
        },
        uiyellow: {
            50: '#FCF7EA',
            100: '#F8EBC9',
            200: '#F2D596',
            300: '#E9B34F',
            400: '#E39B2C',
            500: '#D3851F',
            600: '#B66518',
            700: '#914817',
            800: '#793A1A',
            900: '#67321C',
            950: '#3C180C'
        },
        uicream: {
            50: '#FDF8EF',
            100: '#FAEACC',
            200: '#F7DCB1',
            300: '#F1C380',
            400: '#EAA14D',
            500: 'E5862A',
            600: '#D66D20',
            700: '#B2541C',
            800: '#8E431E',
            900: '#73391B',
            950: '#3E1B0C'
        },
        uimuted: {
          100: "rgb(241, 245, 249)",
          200: "rgb(226 232 240)",
          300: "rgb(203 213 225)",
          400: "rgb(148 163 184)",
          500: "rgb(100 116 139)",
          600: "rgb(71 85 105)",
          700: "rgb(51 65 85)",
          800: "#304159",
          900: "#152342",
          950: "rgb(2 6 23)"
        }
      }
    }
  }
}

