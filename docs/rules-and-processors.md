# SuperForm Validator – Rules and Processors Reference

---

## 📄 Field Rules

| Rule                  | Signature                                  | Aliases                             | Description                                                    |
| --------------------- | ------------------------------------------ | ----------------------------------- | -------------------------------------------------------------- |
| optional              | optional                                   | -                                   | Field is optional                                              |
| field::require        | field::require                             | require                             | Field is required                                              |
| field::requireIf      | field::requireIf(anotherField=value)       | requireIf(anotherField=value)       | Field is required if another field equals a specific value     |
| field::requireUnless  | field::requireUnless(anotherField=value)   | requireUnless(anotherField=value)   | Field is required unless another field equals a specific value |
| field::requireWith    | field::requireWith(field1, field2, ...)    | requireWith(field1, field2, ...)    | Field is required if any of the listed fields are present      |
| field::requireWithout | field::requireWithout(field1, field2, ...) | requireWithout(field1, field2, ...) | Field is required if any of the listed fields are absent       |
| field::match          | field::match(anotherField)                 | match(anotherField)                 | Field must match another field                                 |
| field::atLeastOne     | field::atLeastOne(field1, field2, ...)     | atLeastOne(field1, field2, ...)     | At least one of given fields is required                       |
| field::onlyOne        | field::onlyOne(field1, field2, ...)        | onlyOne(field1, field2, ...)        | Only one of given fields is required                           |
| field::allOrNone      | field::allOrNone(field1, field2, ...)      | allOrNone(field1, field2, ...)      | All of given fields is required                                |
| field::noEmpty        | field::noEmpty                             | noEmpty                             | Field cant be undefined, empty (string, array, object) or null |
| field::noNull         | field::noNull                              | noNull                              | Field cant be null                                             |
| field::requireOrNull  | field::requireOrNull                       | requireOrNull                       | Field is required or can be null                               |

---

## Number Rules

| Rule               | Signature                         | Aliases                      | Description                                   |
| ------------------ | --------------------------------- | ---------------------------- | --------------------------------------------- |
| number::valid      | number::valid                     | number, numeric              | Must be a valid finite number                 |
| number::positive   | number::positive                  | positiveNumber               | Must be a positive number (≥ 0)               |
| number::negative   | number::negative                  | negativeNumber               | Must be a negative number (< 0)               |
| number::min        | number::min(number)               | minNum(number)               | Minimum numeric value                         |
| number::max        | number::max(number)               | maxNum(number)               | Maximum numeric value                         |
| number::between    | number::between(number1, number2) | numBetween(number1, number2) | Must be between specified numbers (inclusive) |
| number::multipleOf | number::multipleOf(number)        | numMultipleOf(number)        | Must be a multiple of specified number        |

---

## 📄 Integer Rules

| Rule               | Signature                            | Aliases                        | Description                                        |
| ------------------ | ------------------------------------ | ------------------------------ | -------------------------------------------------- |
| integer::valid     | integer::valid                       | integer, int                   | Must be a valid integer                            |
| integer::positive  | integer::positive                    | positiveInt                    | Must be a positive integer                         |
| integer::negative  | integer::negative                    | negativeInt                    | Must be a negative integer                         |
| integer::min       | integer::min(integer)                | minInt(integer)                | Minimum integer value                              |
| integer::max       | integer::max(integer)                | maxInt(integer)                | Maximum integer value                              |
| integer::between   | integer::between(integer1, integer2) | intBetween(integer1, integer2) | Must be between specified integers                 |
| integer::even      | integer::even                        | evenInt                        | Must be an even integer                            |
| integer::odd       | integer::odd                         | oddInt                         | Must be an odd integer                             |
| integer::equals    | integer::equals(integer)             | intEquals(integer)             | Must equal specified integer                       |
| integer::notEquals | integer::notEquals(integer)          | intNotEquals(integer)          | Must not equal specified integer                   |
| integer::gt        | integer::gt(integer)                 | gt(integer)                    | Must be greater than specified integer             |
| integer::gte       | integer::gte(integer)                | gte(integer)                   | Must be greater than or equal to specified integer |
| integer::lt        | integer::lt(integer)                 | lt(integer)                    | Must be less than specified integer                |
| integer::lte       | integer::lte(integer)                | lte(integer)                   | Must be less than or equal to specified integer    |

---

## 📄 Float Rules

| Rule             | Signature                      | Aliases                      | Description                                      |
| ---------------- | ------------------------------ | ---------------------------- | ------------------------------------------------ |
| float::valid     | float::valid                   | float, double                | Must be a valid float                            |
| float::positive  | float::positive                | positiveFloat                | Must be a positive float                         |
| float::negative  | float::negative                | negativeFloat                | Must be a negative float                         |
| float::min       | float::min(float)              | minFloat(float)              | Minimum float value                              |
| float::max       | float::max(float)              | maxFloat(float)              | Maximum float value                              |
| float::between   | float::between(float1, float2) | floatBetween(float1, float2) | Must be between specified floats                 |
| float::equals    | float::equals(float)           | floatEquals(float)           | Must equal specified float                       |
| float::notEquals | float::notEquals(float)        | floatNotEquals(float)        | Must not equal specified float                   |
| float::gt        | float::gt(float)               | floatGt(float)               | Must be greater than specified float             |
| float::gte       | float::gte(float)              | floatGte(float)              | Must be greater than or equal to specified float |
| float::lt        | float::lt(float)               | floatLt(float)               | Must be less than specified float                |
| float::lte       | float::lte(float)              | floatLte(float)              | Must be less than or equal to specified float    |
| float::longitude | float::longitude               | longitude                    | Must be a valid longitude (`-180` to `180`)      |
| float::latitude  | float::latitude                | latitude                     | Must be a valid latitude (`-90` to `90`)         |

---

## 📄 String Rules

| Rule                   | Signature                             | Aliases                             | Description                               |
| ---------------------- | ------------------------------------- | ----------------------------------- | ----------------------------------------- |
| string::valid          | string::valid                         | string                              | Must be a valid string                    |
| string::minLength      | string::minLength(integer)            | minLength(integer)                  | Minimum string length                     |
| string::maxLength      | string::maxLength(integer)            | maxLength(integer)                  | Maximum string length                     |
| string::length         | string::length(integer)               | length(integer)                     | Exact string length                       |
| string::alpha          | string::alpha                         | alpha                               | Alphabets only                            |
| string::alphaspace     | string::alphaspace                    | alphaspace                          | Alphabets and spaces                      |
| string::alphanum       | string::alphanum                      | alphanum                            | Alphabets and numbers                     |
| string::alphanumspace  | string::alphanumspace                 | alphanumspace                       | Alphabets, numbers, and spaces            |
| string::in             | string::in(string1, string2, ...)     | inList(string1, string2, ...)       | Must be in provided list                  |
| string::notIn          | string::notIn(string1, string2, ...)  | notInList(string1, string2, ...)    | Must not be in provided list              |
| string::equals         | string::equals(string)                | strEquals(string)                   | Must equal specified string               |
| string::notEquals      | string::notEquals(string)             | strNotEquals(string)                | Must not equal specified string           |
| string::contains       | string::contains(string)              | strContains(string)                 | Must contain specified string             |
| string::notContains    | string::notContains(string)           | strNotContains(string)              | Must not contain specified string         |
| string::startsWith     | string::startsWith(string)            | strStartsWith(string)               | Must start with specified string          |
| string::notStartsWith  | string::notStartsWith(string)         | strNotStartsWith(string)            | Must not start with specified string      |
| string::endsWith       | string::endsWith(string)              | strEndsWith(string)                 | Must end with specified string            |
| string::notEndsWith    | string::notEndsWith(string)           | strNotEndsWith(string)              | Must not end with specified string        |
| string::lowercase      | string::lowercase                     | strLowercase                        | Must be lowercase                         |
| string::uppercase      | string::uppercase                     | strUppercase                        | Must be uppercase                         |
| string::strongPassword | string::strongPassword                | strongPassword                      | Must be a strong password                 |
| string::email          | string::email                         | email                               | Must be a valid email address             |
| string::mobile         | string::mobile                        | mobile                              | Must be a valid mobile number             |
| string::pincode        | string::pincode                       | pincode                             | Must be a valid pincode                   |
| string::pan            | string::pan                           | pan                                 | Must be a valid PAN card                  |
| string::ifsc           | string::ifsc                          | ifsc                                | Must be a valid IFSC code                 |
| string::slug           | string::slug                          | slug                                | Must be a valid slug                      |
| string::url            | string::url                           | url                                 | Must be a valid URL                       |
| string::urlSecure      | string::urlSecure                     | urlSecure                           | Must be a secure URL (i.e. https)         |
| string::domain         | string::domain                        | domain                              | Must be a valid domain                    |
| string::ip             | string::ip                            | ip                                  | Must be a valid IP address                |
| string::ipv4           | string::ipv4                          | ipv4                                | Must be a valid IPv4 address              |
| string::ipv6           | string::ipv6                          | ipv6                                | Must be a valid IPv6 address              |
| string::uuid           | string::uuid                          | uuid                                | Must be a valid UUID                      |
| string::noSpace        | string::noSpace                       | noSpace                             | Must not contain spaces                   |
| string::noEmoji        | string::noEmoji                       | noEmoji                             | Must not contain emojis                   |
| string::asciiOnly      | string::asciiOnly                     | asciiOnly                           | Must contain only ASCII characters        |
| string::json           | string::json                          | jsonString                          | Must be a valid JSON string               |
| string::wordCount      | string::wordCount(integer1, integer2) | wordCount(integer1, integer2)       | Word count must be within specified range |
| string::latlong        | string::latlong                       | latlong                             | Must be a valid latitude,longitude pair   |

---

## 📄 Boolean Rules

| Rule                   | Signature                             | Aliases                             | Description                               |
| ---------------------- | ------------------------------------- | ----------------------------------- | ----------------------------------------- |
| boolean::valid         | boolean::valid                        | boolean, bool                       | Must be a valid boolean value             |

---

## 📅 Date Rules

| Rule          | Signature                   | Aliases                   | Description                         |
| ------------- | --------------------------- | ------------------------- | ----------------------------------- |
| date::valid   | date::valid                 | date                      | Must be a valid date (YYYY-MM-DD)   |
| date::before  | date::before(date)          | dateBefore(date)          | Must be before the specified date   |
| date::after   | date::after(date)           | dateAfter(date)           | Must be after the specified date    |
| date::equals  | date::equals(date)          | dateEquals(date)          | Must be same as specified date      |
| date::between | date::between(date1, date2) | dateBetween(date1, date2) | Must be between the specified dates |
| date::today   | date::today                 | dateToday                 | Must be tody's date                 |
| date::past    | date::past                  | datePast                  | Must be past date                   |
| date::future  | date::future                | dateFuture                | Must be future date                 |

> date parameter should be passed in (YYYY-MM-DD) format

---

## 🕔 Time Rules

| Rule          | Signature                   | Aliases                   | Description                               |
| ------------- | --------------------------- | ------------------------- | ----------------------------------------- |
| time::valid   | time::valid                 | time                      | Must be a valid time (HH:MM or HH:MM:SS)  |
| time::before  | time::before(time)          | timeBefore(time)          | Must be before the specified time         |
| time::after   | time::after(time)           | timeAfter(time)           | Must be after the specified time          |
| time::equals  | time::equals(time)          | timeEquals(time)          | Must be same as specified time            |
| time::between | time::between(time1, time2) | timeBetween(time1, time2) | Must be between the specified times       |

> time parameter should be passed in (HH:MM or HH:MM:SS) format

---

## 🧭 Datetime Rules

| Rule              | Signature                               | Aliases                               | Description                                    |
| ----------------- | --------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| datetime::valid   | datetime::valid                         | datetime                              | Must be a valid datetime (YYYY-MM-DD HH:MM:SS) |
| datetime::before  | datetime::before(datetime)              | datetimeBefore(datetime)              | Must be before the specified datetime          |
| datetime::after   | datetime::after(datetime)               | datetimeAfter(datetime)               | Must be after the specified datetime           |
| datetime::equals  | datetime::equals(date)                  | datetimeEquals(date)                  | Must be same as specified datetime             |
| datetime::between | datetime::between(datetime1, datetime2) | datetimeBetween(datetime1, datetime2) | Must be between the specified datetimes        |
| datetime::past    | datetime::past                          | datetimePast                          | Must be past datetime                          |
| datetime::future  | datetime::future                        | datetimeFuture                        | Must be future datetime                        |

> datetime parameter should be passed in (YYYY-MM-DD HH:MM:SS) format

---

## 📎 File Rules

| Rule             | Signature                           | Aliases        | Description                                        |
| ---------------- | ----------------------------------- | -------------- | -------------------------------------------------- |
| file::valid      | file::valid                         | file           | Must be a valid file input                         |
| file::minFiles   | file::minFiles(integer)             | minFiles       | Minimum number of files require                    |
| file::maxFiles   | file::maxFiles(integer)             | maxFiles       | Maximum number of files allowed                    |
| file::minSize    | file::minSize(size)                 | minFileSize    | Minimum file size (supports kb, mb, gb) (e.g. 2mb) |
| file::maxSize    | file::maxSize(size)                 | maxFileSize    | Maximum file size (supports kb, mb, gb)            |
| file::accepts    | file::accepts(type1\,type2\,...)    | fileAccepts    | Allowed file extensions or MIME types              |
| file::notAccepts | file::notAccepts(type1\,type2\,...) | fileNotAccepts | Not allowed file extensions or MIME types          |
| file::imageOnly  | file::imageOnly                     | fileImageOnly  | Only image files allowed                           |
| file::videoOnly  | file::videoOnly                     | fileVideoOnly  | Only video files allowed                           |
| file::audioOnly  | file::audioOnly                     | fileAudioOnly  | Only audio files allowed                           |

---

## 📂 Array Rules

| Rule            | Signature                | Aliases                                     | Description                                               |
| --------------- | ------------------------ | ------------------------------------------- | --------------------------------------------------------- |
| array::valid    | array::valid             | array                                       | Must be a valid array                                     |
| array::notEmpty | array::notEmpty          | notEmptyArray                               | Must not be empty array                                   |
| array::unique   | array::unique            | uniqueArray                                 | Array items must be unique                                |
| array::minItems | array::minItems(integer) | minItems                                    | Minimum number of items in array                          |
| array::maxItems | array::maxItems(integer) | maxItems                                    | Maximum number of items in array                          |
| array::includes | array::includes(item)    | arrayIncludes(item), arrayContains(item)    | Array must include specified item                         |
| array::excludes | array::excludes(item)    | arrayExcludes(item), arrayNotContains(item) | Array must not include specified item                     |
| array::latLong  | array::latLong           | latLongArray                                | Array must a valid [latitude, longitude] coordinate array |
| array::longLat  | array::longLat           | longLatArray                                | Array must a valid [longitude, latitude] coordinate array |
| array::of       | array::of(type)          | arrayOf                                     | Array must be type of type array<type> ex. arrayOf(number)|
| array::notOf    | array::notOf(type)       | arrayNotOf                                  | Array must not be type of type array<type>                |

> *Available types to check:* `undefined`|`null`|`string`|`number`|`integer`|`float`|`boolean`|`array`|`object`

---

## 📄 Object Rules

| Rule                         | Signature                        | Aliases                                     | Description                                                |
| ---------------------------- | -------------------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| object::valid                | object::valid                    | object                                      | Must be a valid object                                     |
| object::notEmpty             | object::notEmpty                 | notEmptyObject                              | Object must not be empty                                   |
| object::includes             | object::includes(key)            | objectIncludes(key), objectContains(key)    | Object must include the specified key                      |
| object::excludes             | object::excludes(key)            | objectExcludes(key), objectNotContains(key) | Object must not include the specified key                  |
| object::hasKeys              | object::hasKeys(key1, key2, …)   | objectHasKeys(key1, key2, …)                | Object must contain **all** specified keys                 |
| object::hasAnyKey            | object::hasAnyKey(key1, key2, …) | objectHasAnyKey(key1, key2, …)              | Object must contain **at least one** of the specified keys |
| object::onlyKeys             | object::onlyKeys(key1, key2, …)  | objectOnlyKeys(key1, key2, …)               | Object must not contain keys outside the specified list    |
| object::minKeys              | object::minKeys(count)           | objectMinKeys(count)                        | Object must contain at least the specified number of keys  |
| object::maxKeys              | object::maxKeys(count)           | objectMaxKeys(count)                        | Object must not exceed the specified number of keys        |
| object::exactKeys            | object::exactKeys(count)         | objectExactKeys(count)                      | Object must contain exactly the specified number of keys   |
| object::allValuesType        | object::allValuesType(type)      | objectValuesType(type)                      | All object values must be of the specified type            |
| object::noNullValues         | object::noNullValues             | objectNoNull                                | Object must not contain `null` values                      |
| object::noUndefinedValues    | object::noUndefinedValues        | objectNoUndefined                           | Object must not contain `undefined` values                 |
| object::deepIncludes         | object::deepIncludes(path)       | objectDeepIncludes(path)                    | Object must include the specified nested key path          |
| object::isPlain              | object::isPlain                  | plainObject                                 | Must be a plain JavaScript object                          |

> *Available types to check:* `undefined`|`null`|`string`|`number`|`integer`|`float`|`boolean`|`array`|`object`


## Schema Rules

| Rule          | Signature              | Aliases | Description                                                                        |
| ------------- | ---------------------- | ------- | ---------------------------------------------------------------------------------- |
| schema        | schema: { ... }        | -       | Validate an object field by applying a nested schema definition                    |
| arrayOfSchema | arrayOfSchema: { ... } | -       | Validate each item of an array against a nested schema (per-index errors returned) |

---

## 🛠️ Custom Rules

| Rule                 | Syntax               | Description                                                    |
| -------------------- | -------------------- | -------------------------------------------------------------- |
| custom(regex)        | custom(/regex/flags) | Validate using custom regex. Invalidate on regex.test is false |

---

## 🔄 Pre and Post Processors

| Rule                         | Aliases           | Description                              |
| ---------------------------- | ----------------- | ---------------------------------------- |
| trim                         | -                 | Trims whitespace from string             |
| preTrim                      | -                 | Trims whitespace before validation       |
| case::camel                  | toCamelcase       | Converts to camelCase                    |
| case::kebab                  | toKebabcase       | Converts to kebab-case                   |
| case::lower                  | toLowercase       | Converts to lowercase                    |
| case::pascal                 | toPascalcase      | Converts to PascalCase                   |
| case::sentence               | toSentencecase    | Converts to Sentence case                |
| case::snake                  | toSnakecase       | Converts to snake_case                   |
| case::title                  | toTitlecase       | Converts to Title Case                   |
| case::upper                  | toUppercase       | Converts to UPPERCASE                    |
| case::ucFirst                | toUcFirst         | Uppercase first character                |
| case::capitalize             | toCapitalize      | Capitalizes each word                    |
| preCase::camel               | preToCamelcase    | Pre-process to camelCase                 |
| preCase::kebab               | preToKebabcase    | Pre-process to kebab-case                |
| preCase::lower               | preToLowercase    | Pre-process to lowercase                 |
| preCase::pascal              | preToPascalcase   | Pre-process to PascalCase                |
| preCase::sentence            | preToSentencecase | Pre-process to Sentence case             |
| preCase::snake               | preToSnakecase    | Pre-process to snake_case                |
| preCase::title               | preToTitlecase    | Pre-process to Title Case                |
| preCase::upper               | preToUppercase    | Pre-process to UPPERCASE                 |
| preCase::ucFirst             | preToUcFirst      | Pre-process to uppercase first character |
| preCase::capitalize          | preToCapitalize   | Pre-process to capitalize each word      |
| cast::string                 | toStr             | Casts to string                          |
| cast::integer                | toInteger         | Casts to integer                         |
| cast::float                  | toFloat           | Casts to float                           |
| cast::boolean                | toBoolean         | Casts to boolean                         |
| cast::toJson                 | toJson            | Casts to JSON string                     |
| cast::fromJson               | fromJson          | Parses from JSON string                  |
| preCast::string              | preToStr          | Pre-cast to string                       |
| preCast::integer             | preToInteger      | Pre-cast to integer                      |
| preCast::float               | preToFloat        | Pre-cast to float                        |
| preCast::boolean             | preToBoolean      | Pre-cast to boolean                      |
| preCast::toJson              | preToJson         | Pre-cast to JSON string                  |
| preCast::fromJson            | preFromJson       | Pre-parse from JSON string               |
| math::ceil                   | ceil, roundUp     | Rounds number up                         |
| math::floor                  | floor, roundDown  | Rounds number down                       |
| math::round                  | round             | Rounds number                            |
| math::toFixed(integer)       | toFixed(integer)  | Fixes number to specified decimal points |

---

## 🔗 Additional Resources

* [HTML Form Validator](./html-form.md)
* [Custom Rule Registration](./custom-rules.md)
* [Express.js Plugin Guide](./express.md)
* [Error Formatter Guide](./error-formatter.md)