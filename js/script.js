const api = new Api();
const totalConfirmedElement = document.querySelector('.total__number');
const totalConfirmedElementHeader = document.querySelector('.header__total');

const dataFromApi = api.getDataFromApi();
dataFromApi
    .then((res) => res.json())
    .then((result) => {
        /// Итоговый список стран с показателями: зараженных, умершиих, выздоровевших
          
        const summed = result.reduce((acc, record) => {
        const { countryRegion, confirmed, deaths, recovered } = record;
          
        if (!acc[countryRegion]) {
           acc[countryRegion] = { confirmed: 0, deaths: 0, recovered: 0 };
        } 
          
        acc[countryRegion].confirmed += confirmed;
        acc[countryRegion].deaths += deaths;
        acc[countryRegion].recovered += recovered;
          
        return acc;
        }, {});
          
        const array = Object.entries(summed).map(function(item) {
            return [item[0], item[1]]
        })

        /// Сортировка по количеству заболевших

        const sortConfirmed = () => {
            const sortArray = array.slice().sort((a, b) => {
                return b[1].confirmed - a[1].confirmed
            })
            return sortArray
        }

        /// Перевод наименования стран

        function countriesTranslate() {
            array.forEach((item) => {
                const index = conEng.indexOf(item[0]);
                item[0] = conRus[index]
            })            
        }    
        countriesTranslate()

        /// Статистика по смертности и выздоровевшим

        const pdr = array.map(function(item) {
            const pd = ((item[1].deaths / item[1].confirmed) * 100).toFixed(2);
            const pr = ((item[1].recovered / item[1].confirmed) * 100).toFixed(2);
            return [item[0], pd, pr]
        })

            /// Отсортированная по убыванию смертность
        const sortPd = () => {
            const copyArr = pdr.slice().sort(function(a, b) {
                return b[1] - a[1]
            })
            return copyArr;
        }


          /// Отсортированные по убыванию случаи выздоровления
        const sortPr = () => {
            const copyArr = pdr.slice().sort(function(a, b) {
                return b[2] - a[2]
            })
            return copyArr;
        }

       /// Всего заболевших

        const totalConfirmed = array.reduce((acc, item) => {
            return acc + item[1].confirmed;
        }, 0);

        totalConfirmedElement.textContent = totalConfirmed;
        totalConfirmedElementHeader.textContent = totalConfirmed;
        
        /// Всего умерших

        const totalDeath = array.reduce((acc, item) => {
            return acc + item[1].deaths;
        }, 0);
        
        /// Всего выздоровело

        const totalRecovered = array.reduce((acc, item) => {
            return acc + item[1].recovered;
        }, 0);

        function setCountryInfo(country) {
            const list = document.querySelector('.sng__table');
            
            sortConfirmed().forEach(function(item) {
                if (item[0] === country) {
                    list.insertAdjacentHTML('beforeend',`
                    <tr class="table__row">
                        <td class="table__data"><img src='./images/flags/${country}.svg' style='max-width: 10%'> ${country}</td>
                        <td class="table__data">${item[1].confirmed}</td>
                        <td class="table__data">${item[1].deaths}</td>
                        <td class="table__data">${item[1].recovered}</td>
                    </tr>
                    `)
                }
            })
        }

        setCountryInfo("Россия")
        setCountryInfo("Украина")
        setCountryInfo("Беларусь")
        setCountryInfo("Эстония")
        setCountryInfo("Литва")
        setCountryInfo("Армения")
        setCountryInfo("Азербайджан")
        setCountryInfo("Казахстан")
        setCountryInfo("Узбекистан")
        setCountryInfo("Латвия")
        setCountryInfo("Киргизия")
        setCountryInfo("Грузия")


        function topTenCountries() {
            const list = document.querySelector('.rating__table');

            for (let i = 0; i < 10; i++) {
                
                list.insertAdjacentHTML('beforeend',`
            <tr class="table__row">
                <td class="table__data">${sortConfirmed()[i][0]}</td>
                <td class="table__data">${sortConfirmed()[i][1].confirmed}</td>
                <td class="table__data">${sortConfirmed()[i][1].deaths}</td>
                <td class="table__data">${sortConfirmed()[i][1].recovered}</td>
            </tr>
            `)

            }

        }
        topTenCountries()

        function topTen() {
            const list = document.querySelector('.diagram')

            for (let i = 0; i < 10; i++) {
                
                list.insertAdjacentHTML('beforeend',`    
                <div class="diagram__row">
                    <div class="diagram__caption">
                        <p class="diagram__country">${sortPd()[i][0]}</p>
                        <p class="diagram__analytics">
                            Смертность
                            <span class="diagram__data diagram__data_type_dead">${sortPd()[i][1]}%</span> •
                            Вылечилось
                            <span class="diagram__data diagram__data_type_healed">${sortPd()[i][2]}%</span>
                        </p>
                    </div>
                    <div class="diagram__line">
                        <div class="diagram__visualisation diagram__visualisation_type_healed" style="width: ${sortPd()[i][2]}%;"></div>
                        <div class="diagram__visualisation diagram__visualisation_type_dead" style="width: ${sortPd()[i][1]}%;"></div>
                    </div>
              </div>`)

            }


        }
        topTen()

    })
        .then(() => {
            function noZeros() {
                const zeroNodes = document.querySelectorAll('.table__data');
                const zerosArray = Array.from(zeroNodes);
                zerosArray.forEach((item) => {
                    if (item.textContent === '0') {
                        item.textContent = 'н/д'
                    }
                })
            }
            noZeros()
        })
