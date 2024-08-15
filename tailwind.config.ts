import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        custom: ['Inter'],
      },
      backgroundImage: {
        'custom-401-gradient': "linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)",
      },
      colors: {
        uiblue: {
          50: '#F2F5FF',
          100: '#E6EAFF',
          200: '#D1D8FF',
          300: '#ACB6FF',
          400: '#7E8AFF',
          500: '#4A50FF',
          600: '#2925FF',
          700: '#1B13EE',
          800: '#160FC8',
          900: '#150FA3',
          950: '#05055F'
        },
        uired: {
            50: '#FFF0F0',
            100: '#FFDEDF',
            200: '#FFC3C4',
            300: '#FF999B',
            400: '#FF5E61',
            500: '#FF2C30',
            600: '#F50D12',
            700: '#CF060A',
            800: '#AB090C',
            900: '#6E0C0E',
            950: '#4D0204'
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

