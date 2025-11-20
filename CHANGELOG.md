## [2.0.5](https://github.com/khairnar2960/superform-validator/compare/v2.0.4...v2.0.5) (2025-11-20)


### Features

* adds additional core rules ([e94aa5b](https://github.com/khairnar2960/superform-validator/commit/e94aa5b40faba39a3586692f37da23c97332b253))
* Adds react plugin ([9b6929a](https://github.com/khairnar2960/superform-validator/commit/9b6929a63ac2d41b25714f6e2e837de1ca0ec9a8))
* Adds support for asynchronous callbacks ([226826f](https://github.com/khairnar2960/superform-validator/commit/226826fbda07575f644613e661309f0ed05580a6)), closes [#3](https://github.com/khairnar2960/superform-validator/issues/3)
* **array:** adds `arrayOf(type)` & `arrayNotOf(type)` rules ([06e96ee](https://github.com/khairnar2960/superform-validator/commit/06e96eeb0adfddd420891b222885094833336a14)), closes [#5](https://github.com/khairnar2960/superform-validator/issues/5)
* **array:** Adds alias for min/max length [#5](https://github.com/khairnar2960/superform-validator/issues/5) ([7b1c729](https://github.com/khairnar2960/superform-validator/commit/7b1c729a4d1534df5c85cca015093a813bb05396))
* **array:** adds longLat rule ([e782e20](https://github.com/khairnar2960/superform-validator/commit/e782e2024751138cca1d0581738f7cbfc85212c4))
* **Boolean:** adds `boolean` rule with alias `bool` ([8153c2d](https://github.com/khairnar2960/superform-validator/commit/8153c2d94ba7e597af233c8718ef36c188f987f1)), closes [#5](https://github.com/khairnar2960/superform-validator/issues/5)

## [2.0.4](https://github.com/khairnar2960/superform-validator/compare/v2.0.3...v2.0.4) (2025-10-31)


### Features

* **array:** adds latLong rule ([a4882a2](https://github.com/khairnar2960/superform-validator/commit/a4882a20672da0a23c95a049c1abbb9e5a794a32))
* **string:** adds latLong rule ([97bc430](https://github.com/khairnar2960/superform-validator/commit/97bc430b373e7f1d786a753aac97d576d4f4a713))

## [2.0.3](https://github.com/khairnar2960/superform-validator/compare/v2.0.2...v2.0.3) (2025-10-31)


### Bug Fixes

* **strongPassword:** Fixed field must contain at least one digit error. ([ba4b3e7](https://github.com/khairnar2960/superform-validator/commit/ba4b3e728280e6e1652e093b67e196a3150f36d7)), closes [#2](https://github.com/khairnar2960/superform-validator/issues/2)

## [2.0.2](https://github.com/khairnar2960/superform-validator/compare/v2.0.1...v2.0.2) (2025-10-12)


### Features

* **Express Middleware:** Allows wrap and ungroup errors in response ([d961dfc](https://github.com/khairnar2960/superform-validator/commit/d961dfc41612503427b7df1e01808ca2039c094e)), closes [#1](https://github.com/khairnar2960/superform-validator/issues/1)

## [2.0.1](https://github.com/khairnar2960/superform-validator/compare/v2.0.0...v2.0.1) (2025-07-05)


### Bug Fixes

* **Action:** Fixes write permission for release ([da16dbd](https://github.com/khairnar2960/superform-validator/commit/da16dbd5c9a67e5b790248bcee3deaed351db148))

## [2.0.0](https://github.com/khairnar2960/superform-validator/compare/v1.0.4...v2.0.0) (2025-07-05)


### Bug Fixes

* **docs:** Fixes documentation internal linking ([ef6a4b8](https://github.com/khairnar2960/superform-validator/commit/ef6a4b8d1c7754d7eedd8f25128035a872aacd83))
* **Workflow:** Fixes GitHub package release build failure ([a00afa4](https://github.com/khairnar2960/superform-validator/commit/a00afa4a2140d0ee8969deaa73ca4d8ae4cf8822))

## [1.0.4](https://github.com/khairnar2960/superform-validator/compare/v1.0.3...v1.0.4) (2025-07-05)


### Features

* Added date rule to validate (YYYY-MM-DD) ([4267b27](https://github.com/khairnar2960/superform-validator/commit/4267b27510c439d9036e42e92a43ea4a488d9c7b))
* Added mobile rule to validate Indian mobile number ([fb05666](https://github.com/khairnar2960/superform-validator/commit/fb05666f47a4c37cd5669593d6e2784ef93e8506))
* Added numeric rule ([bcab0fc](https://github.com/khairnar2960/superform-validator/commit/bcab0fc364fdd3a2ab7b20662522909815c56d1f))
* Added time rule to validate (HH:MM:SS) ([db82e16](https://github.com/khairnar2960/superform-validator/commit/db82e16711627724962940336de3401ee1fcb227))
* Added url rule ([24f827c](https://github.com/khairnar2960/superform-validator/commit/24f827cc565f7e6e48137e99d8cfd0c69d78839d))
* **Array:** Adds excludes rule to check is value not in array ([a009d91](https://github.com/khairnar2960/superform-validator/commit/a009d915c94ec54ed40911ee996184659534520b))
* **Array:** Adds includes rule to check is value in array ([6f68623](https://github.com/khairnar2960/superform-validator/commit/6f68623fedc21faf487352977b183a227a07d1ff))
* **array:** adds support for array rules ([d7de00c](https://github.com/khairnar2960/superform-validator/commit/d7de00c938d7d3d256acf9df216e538e5759fbd4))
* **case:** adds function to upper case first letter ([a330688](https://github.com/khairnar2960/superform-validator/commit/a3306888299655b69f66a7c8ff563271e5ecacb0))
* **CaseConverter:** adds additional methods capitalize, & ucFirst ([9538a62](https://github.com/khairnar2960/superform-validator/commit/9538a62f74a309b6be13b2299ce2d0731fb5831c))
* Custom position for error element ([50231a6](https://github.com/khairnar2960/superform-validator/commit/50231a66f383166b8d7e8c94ababb2a71b7eb66f))
* **date:** adds new rules today, past & future ([9863147](https://github.com/khairnar2960/superform-validator/commit/98631478762cf400a381efe78de8ecb7097a4ca6))
* **datetime:** adds future rule ([5b5e558](https://github.com/khairnar2960/superform-validator/commit/5b5e558df2812100abe516b9e38ae1de331ea155))
* **datetime:** adds past rule ([a18fbc2](https://github.com/khairnar2960/superform-validator/commit/a18fbc2ab428f10aaba22f97deff3c3158ef8829))
* **errorFormatter:** add support for object path, array, default values ([5fde3d7](https://github.com/khairnar2960/superform-validator/commit/5fde3d7486c3d079e13014abd0787076c5612724))
* **ErrorFormatter:** Ads modifier trim, lower, upper & capitalize ([133473e](https://github.com/khairnar2960/superform-validator/commit/133473e983955fd99c4767249d1171026c3d67e4))
* **express:** added support to validate express body, params & query ([55c6309](https://github.com/khairnar2960/superform-validator/commit/55c630962204a953580c4e91ad8931b9ddc79787))
* **field:** adds requireIf rule ([db825b9](https://github.com/khairnar2960/superform-validator/commit/db825b99ed041ba23f0627aae994c5720f6b8648))
* **field:** adds requireUnless rule ([57afe54](https://github.com/khairnar2960/superform-validator/commit/57afe54ac8cd22df932033a162954568c81938da))
* **field:** adds requireWith rule ([8b5e7c1](https://github.com/khairnar2960/superform-validator/commit/8b5e7c17e16cdf1f707618a10d597e0420b4ada4))
* **field:** adds requireWithout rule ([8095c4d](https://github.com/khairnar2960/superform-validator/commit/8095c4d2552fd4e18699c91f935015d51fdbfa6b))
* **file:** adds audioOnly rule ([ae55027](https://github.com/khairnar2960/superform-validator/commit/ae550278227fcd4d83a613bfad37cdb151fbbec5))
* **file:** adds imageOnly rule ([cc335b8](https://github.com/khairnar2960/superform-validator/commit/cc335b80542bc91fce713f2d006215ee4eefe911))
* **file:** adds minFiles rule ([b55b7bf](https://github.com/khairnar2960/superform-validator/commit/b55b7bffd7d22d285a2431cda1a16e559ae528b0))
* **file:** adds minSize rule ([0a617c5](https://github.com/khairnar2960/superform-validator/commit/0a617c50e0d87b74234ccae436813e20d1e2f2a9))
* **File:** Adds noAccepts rule ([4834354](https://github.com/khairnar2960/superform-validator/commit/483435472424bb036c01af471625904bb9af77f9))
* **file:** adds videoOnly rule ([91d7f05](https://github.com/khairnar2960/superform-validator/commit/91d7f0560e249ffde9bd5e5dde316c15a916a87a))
* **random:** Adds random data generator ([bea2277](https://github.com/khairnar2960/superform-validator/commit/bea2277f5319f02ca6fa98163c100007cd48c7c3))
* **registerRule:** allow add custom rule using registerRule ([33caab1](https://github.com/khairnar2960/superform-validator/commit/33caab1f35c88025703e48ad9509f50c1d161c46))
* **round:** adds support to round number ([4c14d99](https://github.com/khairnar2960/superform-validator/commit/4c14d99cabff98ddcade364b57bb7258aee8538b))
* Signed (+/-) integer, float support added ([9e111b1](https://github.com/khairnar2960/superform-validator/commit/9e111b1f79966db40ab79904462b5fa87e12af8a))
* **string:** adds asciiOnly rule ([dbf7088](https://github.com/khairnar2960/superform-validator/commit/dbf7088d6fe1043cb6c98e719f4c13b722292d3e))
* **string:** adds domain rule ([8f661ea](https://github.com/khairnar2960/superform-validator/commit/8f661eae06b86128f0330008b2c85461c22a940c))
* **string:** adds ip, ipv4 & ipv6 rules ([368e4ff](https://github.com/khairnar2960/superform-validator/commit/368e4ff47f6724bf8846f18468c14e462b7f6be7))
* **string:** adds json rule ([3f34b2d](https://github.com/khairnar2960/superform-validator/commit/3f34b2d2b7f4eec7c3cdc358eb96a35d51593509))
* **string:** adds lowercase rule ([588cbc6](https://github.com/khairnar2960/superform-validator/commit/588cbc62e902c8734c8ce713656bb937796dbb06))
* **string:** adds noEmoji rule ([4190d25](https://github.com/khairnar2960/superform-validator/commit/4190d25be2dcf105e80a4251457e54d5be473091))
* **string:** adds noSpace rule ([80abad9](https://github.com/khairnar2960/superform-validator/commit/80abad996ff93a8d71eb417f92c65c234ad2eca8))
* **string:** adds uppercase rule ([16f1cf3](https://github.com/khairnar2960/superform-validator/commit/16f1cf3cb4b212552cba8ecf50d3187ac4b1512f))
* **string:** adds urlSecure rule ([d930f98](https://github.com/khairnar2960/superform-validator/commit/d930f98acd2b8ba47d0b10be58c6127b67eaf97a))
* **string:** adds uuid rule ([b1a1274](https://github.com/khairnar2960/superform-validator/commit/b1a127496af8c5d774726dd9af942c776d9d7463))
* **string:** adds wordCount rule ([0f486ee](https://github.com/khairnar2960/superform-validator/commit/0f486ee173d1f8777d7e1ba3411040ed754c86fb))
* **validatorEngine:** validator engine has validate method ([84a5f7a](https://github.com/khairnar2960/superform-validator/commit/84a5f7a14a9c96062c6cb44b5c6d780fa926cc93))


### Bug Fixes

* **alias:** fixes alias names and param types ([215df21](https://github.com/khairnar2960/superform-validator/commit/215df21b06e44c3fe34c884bc7f94ae91c49a637))
* **build:** fixes umd build including minified ([fbac251](https://github.com/khairnar2960/superform-validator/commit/fbac25139d2a1125d3144ae54acc0c0b2c090ab0))
* **core:** fixes isJson failed on array ([2023ba0](https://github.com/khairnar2960/superform-validator/commit/2023ba0209bd42a72c7feca3103aa4e136cb887d))
* **dateRule:** validation with date fixed ([9088f9e](https://github.com/khairnar2960/superform-validator/commit/9088f9eeb4990f6b399e03633ac1613e37da5908))
* **datetime:** fixes argument types ([775163c](https://github.com/khairnar2960/superform-validator/commit/775163cb48e3987550012ef141c0f80116e7c827))
* **DateTime:** Fixes naming typos in rule aliases ([78692d8](https://github.com/khairnar2960/superform-validator/commit/78692d8dc5817ac8b5ff2e3612c9c0670909fcd4))
* Duplicate error messages removed on invalid ([d2541d9](https://github.com/khairnar2960/superform-validator/commit/d2541d98b602cd97e38430a3d0dc2b9029e6359a))
* **ErrorFormatter:** fixes multiple fallback with nested object path ([b862e69](https://github.com/khairnar2960/superform-validator/commit/b862e69d57751ff4754cfb659985e99695267745))
* **ErrorFormatter:** handles multiple modifier for each fallback ([f2d3f4f](https://github.com/khairnar2960/superform-validator/commit/f2d3f4f3b3e512c4782f951945a97367e995e00f))
* Field missing error shown if removed from DOM ([cac28c9](https://github.com/khairnar2960/superform-validator/commit/cac28c94ff5a9a329d096b3b6c1c227afe14dc66))
* **File:** Compares all files size with given limit ([9e8f227](https://github.com/khairnar2960/superform-validator/commit/9e8f2275976216a75efd1bb5d021ccae0c4764ca))
* **File:** Fixes file validation rule ([f3472d0](https://github.com/khairnar2960/superform-validator/commit/f3472d015cba9705c78b4f6387a72d928a525ab5))
* handles custom & default rule ([dc6565f](https://github.com/khairnar2960/superform-validator/commit/dc6565f9647984ed7b75f57ae7f33b004fa8bcce))
* **index:** imports updated ([1178a10](https://github.com/khairnar2960/superform-validator/commit/1178a10e8655e03b78c678a27b566aa02cce090f))
* instance method addCustomRule replaced with static registerRule ([682666c](https://github.com/khairnar2960/superform-validator/commit/682666c210c13b31f0e812b00dc9f97e9063a0ad))
* **integerError:** error message fixed ([fe49768](https://github.com/khairnar2960/superform-validator/commit/fe497689290f3d21b64cc5e2a8d993b3606906ec))
* **paramParser:** date, time & date time parsing handled ([3f582a5](https://github.com/khairnar2960/superform-validator/commit/3f582a55661ef24ba3618e7317694d6eeafb89da))
* **rules:** fixes error messages for field, file, float, integer & time ([2b6c967](https://github.com/khairnar2960/superform-validator/commit/2b6c967b3ae58dd3b1bc45177e9c6daaace529c4))
* **schemaParser:** validation function will be return for matching rule ([5f36e16](https://github.com/khairnar2960/superform-validator/commit/5f36e16ba530b935b17b41bcdee8acf6eb7b9007))
* **string:** error message formatting fixed ([c0ca7c8](https://github.com/khairnar2960/superform-validator/commit/c0ca7c81fa600fe587e2b1cb1a7c71e2640929af))
* **timeRule:** validation with time fixed ([e546258](https://github.com/khairnar2960/superform-validator/commit/e54625850a41c382a1614745cdf64a3c337f47a5))
* undefined `Rule` on custom validation error message formatting ([1366678](https://github.com/khairnar2960/superform-validator/commit/1366678af6ee050b8473a2804357e10dd3a02a61))
* **Validator Engine:** supports default value processing ([56d954e](https://github.com/khairnar2960/superform-validator/commit/56d954ec33b7cd5dc7e05bf8ef69f058da67ab05))
* **validator:** fixes file validations ([53c70e4](https://github.com/khairnar2960/superform-validator/commit/53c70e4533742367308d2da5835aee7b38dc2f64))
* **validator:** fixes multiple checkbox validation as array ([4129e7e](https://github.com/khairnar2960/superform-validator/commit/4129e7e10a54944a7cd2c665d3fc83e32518416b))
* **validator:** fixes radio input require validation failure ([857338c](https://github.com/khairnar2960/superform-validator/commit/857338c08a7d2fb0a7194bde22919c61ee52d5f9))

## [1.0.3](https://github.com/khairnar2960/superform-validator/compare/v1.0.2...v1.0.3) (2025-06-27)


### Features

* options can accept error id template ([140ad4f](https://github.com/khairnar2960/superform-validator/commit/140ad4ffdfee04720923cdb57ad3b9bf13dc3035))


### Bug Fixes

* Field missing error shown if removed from DOM ([3e00ded](https://github.com/khairnar2960/superform-validator/commit/3e00ded8881f603c4834c3f46c677fda31c2d95f))

## [1.0.2](https://github.com/khairnar2960/superform-validator/compare/v1.0.1...v1.0.2) (2025-06-26)


### Features

* Added date rule to validate (YYYY-MM-DD) ([0fcd628](https://github.com/khairnar2960/superform-validator/commit/0fcd6286ac090c52f6cbb9542942b1c9c9936788))
* Added mobile rule to validate Indian mobile number ([1a9f509](https://github.com/khairnar2960/superform-validator/commit/1a9f5099cd2acedf190d05bcfcf8e1d88b1f9c47))
* Added numeric rule ([f600c70](https://github.com/khairnar2960/superform-validator/commit/f600c70b686df1586c1d9463de648347d4f2b78c))
* Added time rule to validate (HH:MM:SS) ([58847ad](https://github.com/khairnar2960/superform-validator/commit/58847ade68b6d9fe51b5aed9f537f8cfa1f89f26))
* Added url rule ([9d5ce43](https://github.com/khairnar2960/superform-validator/commit/9d5ce437db947936fd0c8b75e707ba33f2c5a371))


### Bug Fixes

* Duplicate error messages removed on invalid ([78ab6e5](https://github.com/khairnar2960/superform-validator/commit/78ab6e5486a22ec7c595b3e8e4d51a90a7cd6b51))

## [1.0.1](https://github.com/khairnar2960/superform-validator/compare/v1.0.0...v1.0.1) (2025-06-26)


### Bug Fixes

* file name typo corrected ([7413a2e](https://github.com/khairnar2960/superform-validator/commit/7413a2e07f589e42a6462cb970df148bf0dcb7c2))

## 1.0.0 (2025-06-26)

