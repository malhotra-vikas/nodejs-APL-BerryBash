/*
 * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * http://aws.amazon.com/asl/
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
const Alexa = require('ask-sdk');

/////////1. Static strings///////////////////////////////////Modify the hard coded data below to make this skill your own!///
//Skill data
var skillName = 'Berry Bash';
var skillDictionaryName = 'MailHaven';
var categoryPlural = 'packages';
var categorySingular = 'package';

var mainImage = 'https://s3.amazonaws.com/ask-samples-resources/berryImages/background-berries-berry-blackberries-87818%2B(1).jpeg';
var mainImgBlurBG = 'https://s3.amazonaws.com/ask-samples-resources/berryImages/main_blur2.png';

var topicData = {
    "Transit": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/raspberry-fruits-fresh-red-52536.jpeg",
        "info": "All packages in transit are hgere here"
    },
    "Delivered": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/pexels-photo-892808.jpeg",
        "info": "All packages delivered are here."
    },
    "Lost": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/pexels-photo-583840.jpeg",
        "info": "All packages lost are here."
    },
    "blueberries": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/summer-blueberries-stephanie-herington.jpg",
        "info": "Blueberry is one of the highest antioxidant capacities among all fruits, vegetables, spices and seasonings. Antioxidants are necessary to optimizing fitness by helping to combat the free radicals that can damage cellular structures as well as DNA. Blueberries are small blue to black colored fruits with a green flesh. They should be rich and bright in color with a natural bloom."
    },
    "elderberries": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/elder-black-elderberry-sambucus-nigra-holder-51962.jpeg",
        "info": "Elderberry also known as Sambucus is from the family of Adoxaceae, which is a genus of flowering plant. Formerly placed in the honeysuckle family, the fruits when ripe are blackish purple in color and globose in shape. With seeds just about 3mm long, they are globular in shape and about 4 mm diameter, calyx persistent at the apex."
    },
    "gooseberries": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/currant-immature-bush-berry-54332.jpeg",
        "info": "Indian gooseberry fruits are of small size and light green in color. They have 6 vertical grooves on them. The taste of the fruit can be described as strong, harsh, and rough. This fruit is round shaped with vertical stripes and has a hard seed inside."
    },
    "cranberries": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/pexels-photo-306800.jpeg",
        "info": "Cranberries are low, creeping shrubs or vines up to 2 metres long and 5 to 20 centimetres in height; they have slender, wiry stems that are not thickly woody and have small evergreen leaves. The flowers are dark pink, with very distinct reflexed petals, leaving the style and stamens fully exposed and pointing forward. They are pollinated by bees. The fruit is a berry that is larger than the leaves of the plant; it is initially light green, turning red when ripe. It is edible, but with an acidic taste that usually overwhelms its sweetness."
    },
    "huckleberries": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/pexels-photo-139749.jpeg",
        "info": "Huckleberry otherwise called hurtleberry is the native fruit of North America. The fruit appear in various dark colors such as red, blue and black and each berry measures 5-10mm in diameter. The fruit is completely edible and possesses a unique sweet taste. These berries are used as a major flavoring agent in juice, tea, soup, pudding, pie, pancakes and jam. It is also used for treating pain and healing heart disease and infections."
    },
    "cherries": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/pexels-photo-175727.jpeg",
        "info": "Cherries are found in the wild and have been domesticated for centuries. There is a myriad of cherry types, resulting from new varieties and hybrids developed for hardiness and flavor. This fruit is found in Asia, Europe, and North America, with Iran, Turkey, United States, Germany, and Italy leading in the production of cherries."
    },
    "gojiberries": {
        "imgURL": "https://s3.amazonaws.com/ask-samples-resources/berryImages/goji-3162716_640.jpg",
        "info": "Goji, goji berry, or wolfberry is the fruit of either the Lycium barbarum or Lycium chinense, two closely related species of boxthorn in the nightshade family, Solanaceae. The family also includes the potato, tomato, eggplant, belladonna, chili pepper, and tobacco. The two species are native to Asia."
    }
}
// Info sourced from fruitsinfo.com
// Royalty free images sourced from pexels/pixabay. See bottom of codes for links

//generic strings, images, etc. You can change some of the data below, but to make this skill your own, focus on the data above
var adjectives = ['craziest', 'hippest', 'tastiest', 'sweetest', 'greatest', 'cheekiest', 'spiciest', 'greatest', 'smartest', 'best'];


const GAMELENGTH = 5;
var testingOnSim = false; //flip to experience voice only skill on display device/simulator

/////////2. Entry point and intent handlers//////////////////////////////////////////////////////////////////////////
const skillBuilder = Alexa.SkillBuilders.standard();

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
    },
    handle(handlerInput) {

        newSessionHandler(handlerInput);

        var speechOutput = 'Welcome to ' + skillName + ', the ' + adjectives[getRandomVal(0, adjectives.length - 1)] + ' stop for knowledge about ' + categoryPlural + ' around. ';
        var reprompt = "What would you like to do?";

        return showSkillIntro(speechOutput, reprompt, handlerInput);
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        //User has outright quit the skill
        return endSkill(handlerInput);
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handleUnknown(handlerInput);
    },
};

const PreviousIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        console.log(`HI ${request.intent.name}`);

        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.PreviousIntent';
    },
    handle(handlerInput) {
        var speechOutput;
        var reprompt;
        const attributes = handlerInput.attributesManager.getSessionAttributes();

        //If we are showing a fruit, go back to the main list
        if (attributes.selectedValueIndex) {
            return showMainList(handlerInput);
        } else if (attributes.skillState == 'gamePlaying') {

        } else {
            return showSkillIntro(speechOutput, reprompt, handlerInput);
        }
    },
};

const MoreInfoIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'MoreInfoIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();

        if (attributes.selectedValueIndex) {
            var objectArray = attributes.mainArray;
            var selectedVal = attributes.selectedValueIndex;
            var speechOutput = objectArray[selectedVal].info;

            const response = handlerInput.responseBuilder;

            response.withShouldEndSession(null);

            saveLastThingSaid(handlerInput, speechOutput);

            return response.speak(speechOutput).getResponse();
        } else {
            return handleUnknown(handlerInput);
        }
    },
};

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.RepeatIntent';
    },
    handle(handlerInput) {

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        var speechOutput = attributes.lastOutputResponse;

        const response = handlerInput.responseBuilder;

        response.withShouldEndSession(null);

        saveLastThingSaid(handlerInput, speechOutput);

        return response.speak(speechOutput).getResponse();
    },
};

const StopIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {


        return endSkill(handlerInput);
    },
};

const CancelIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput) {
        //Provide instructions based on skill state
        newSessionHandler(handlerInput);

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        var speechOutput;
        var reprompt;

        if (attributes.skillState == 'gamePlaying') {
        } else {
            reprompt = 'Which ' + categorySingular + ' would you like to hear about?'
            return showSkillIntro(speechOutput, reprompt, handlerInput);
        }
    },
};

const InformationIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'InformationIntent';
    },
    handle(handlerInput) {
        var speechOutput;
        var reprompt;

        newSessionHandler(handlerInput);

        const attributes = handlerInput.attributesManager.getSessionAttributes();
        if (attributes.skillState == 'gamePlaying') {

        } else {

            return showMainList(handlerInput);
        }
    },
};

const NextIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.NextIntent';
    },
    handle(handlerInput) {
        //Provide instructions based on skill state
        newSessionHandler(handlerInput);

        return handleUnknown(handlerInput);
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        //Provide instructions based on skill state
        newSessionHandler(handlerInput);

        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const response = handlerInput.responseBuilder;

        var speechOutput;
        var reprompt;

        if (attributes.skillState == 'gamePlaying') {
        } else {
            reprompt = 'Which ' + categorySingular + ' would you like to hear about?'
            return showSkillIntro(speechOutput, reprompt, handlerInput);
        }
    },
};

const ElementSelectedHandler = {
    canHandle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        console.log(`Static HI in Element Selected Handler`);

        console.log(`HI in Element Selected Handler: ${request.intent.name}`);

        return (request.type === 'IntentRequest' &&
            request.intent.name === 'ElementSelected')
            || request.type === 'Display.ElementSelected';
    },
    handle(handlerInput) {
        newSessionHandler(handlerInput);

        var speechOutput;

        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const response = handlerInput.responseBuilder;

        if (attributes.skillState == 'gamePlaying') {
        } else //User is not playing game
        {

            var objectArray = attributes.mainArray;

            //Screen touched
            if (handlerInput.requestEnvelope.request.token) {

                if (handlerInput.requestEnvelope.request.token == "dictionary_token") {
                    //Open dictionary
                    return showMainList(handlerInput);
                } else if (handlerInput.requestEnvelope.request.token == "read_info_token") {
                    //read out information
                    var selectedIndex = attributes.selectedValueIndex;
                    speechOutput = objectArray[selectedIndex].info;

                    response.withShouldEndSession(null);

                    saveLastThingSaid(handlerInput, speechOutput);

                    return response.speak(speechOutput).getResponse();
                }

                if (handlerInput.requestEnvelope.request.token == "dictionary_token") {
                    //'Go back' action link selectex
                    resetAttributes(handlerInput);
                    return showMainList(handlerInput);
                } else {
                    //Something else selected, most likely from our main list (only list available outside of game)
                    var valueToken = handlerInput.requestEnvelope.request.token;
                    var result = matchChecker(objectArray, valueToken);
                    return showSpecificItemInfo(handlerInput, result, objectArray);
                }
            } else if (handlerInput.requestEnvelope.request.intent.slots.categoryValue.value) {
                //If the user chooses their selection via voice
                resetAttributes(handlerInput);

                var userFruit = handlerInput.requestEnvelope.request.intent.slots.categoryValue.value;
                var iresult = matchChecker(objectArray, userFruit);

                if (iresult) {
                    return showSpecificItemInfo(handlerInput, iresult, objectArray);
                } else {
                    return handleUnknown(handlerInput);
                }
            } else if (handlerInput.requestEnvelope.request.intent.slots.numberValue.value) {
                //If the user chooses their selection via voice
                resetAttributes(handlerInput);

                var userChoiceNumber1 = parseInt(handlerInput.requestEnvelope.request.intent.slots.numberValue.value);

                if (userChoiceNumber1 > 0 && userChoiceNumber1 < objectArray.length + 1) {
                    //If within the range of options offered
                    return showSpecificItemInfo(handlerInput, userChoiceNumber1 - 1, objectArray);
                } else {
                    speechOutput = 'Please say a number between 1 and ' + objectArray.length;

                    response.withShouldEndSession(null);

                    saveLastThingSaid(handlerInput, speechOutput);

                    return response.speak(speechOutput).getResponse();
                }
            } else {
                //If this intent is hit without the needed data 
                return handleUnknown(handlerInput);
            }
        }
    },
};

const NoIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        newSessionHandler(handlerInput);

        var speechOutput;
        var reprompt;

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        //User wants to stop playing game
        if (attributes.skillState == 'gamePlaying') {
        } else {
            return endSkill(handlerInput);
        }
    },
};

const YesIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        newSessionHandler(handlerInput);

        var speechOutput;

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        if (attributes.skillState == 'quizMainMenu') {

        } else if (attributes.skillState == 'gamePlaying') {

        } else {
            return handleUnknown(handlerInput);
        }
    },
};

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        InformationIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        ElementSelectedHandler,
        HelpIntentHandler,
        CancelIntentHandler,
        StopIntentHandler,
        RepeatIntentHandler,
        MoreInfoIntentHandler,
        NextIntentHandler,
        PreviousIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();

////////3. Helper functions//////////////////////////////////////////////////////////////////////////
//Generic functions///////////////////////////////////////////////////////////////////
function matchChecker(pArray, pCompare1) {
    for (let i = 0; i < pArray.length; i++) {
        //Find out which value 
        if (pCompare1.toLowerCase() == pArray[i].name.toLowerCase() || pCompare1.toLowerCase() == pArray[i].token.toLowerCase()) {
            //Returns index of match for later use
            return i;
        }
    }
}

function generateRandResponse(pArray, pSpeechCon) {
    var r = getRandomVal(0, pArray.length);

    if (pSpeechCon) {
        return '<say-as interpret-as="interjection">' + pArray[r] + '</say-as>. ';
    } else {
        return pArray[r];
    }
}

function getRandomVal(pMin, pMax) {
    return Math.floor((Math.random() * pMax) + pMin);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createArrayValue(pName, pImageURL, pInfo) //object creation
{
    var value = {
        name: pName,
        imageURL: pImageURL,
        info: pInfo,
        token: pName + 'Token',
    };

    return value;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
//Alexa specific helper functions///////////////////////////////////////////////////////////////////
function showSpecificItemInfo(pHandlerInput, pIndex, pArray) {
    //User has selected a single fruit to get more info
    const attributes = pHandlerInput.attributesManager.getSessionAttributes();
    const response = pHandlerInput.responseBuilder;

    attributes.selectedValueIndex = pIndex;

    if (supportsDisplay(pHandlerInput) && !testingOnSim) {
        return bodyTemplateMaker('BodyTemplate3', pHandlerInput, pArray[pIndex].imageURL, capitalizeFirstLetter(pArray[pIndex].name), '<action value="read_info_token"><b>Read</b></action> | <action value="dictionary_token"><b>Back</b></action><br/>', pArray[pIndex].info, null, 'Here is some information about ' + pArray[pIndex].name + '.', null, 'test me on ' + categoryPlural, mainImgBlurBG, false);
    } else {
        var reprompt = 'Which ' + categorySingular + ' would you like to hear about now?';
        var speechOutput = pArray[pIndex].info + ' ' + reprompt;

        saveLastThingSaid(pHandlerInput, speechOutput);

        return response.speak(speechOutput).reprompt(reprompt).getResponse();
    }
}

function handleUnknown(pHandlerInput) {
    //For when Alexa doesn't understand the user
    var speechOutput = 'I am sorry. I did not quite get that one. Could you try again?';
    var reprompt = 'Could you try again?';

    const response = pHandlerInput.responseBuilder;

    saveLastThingSaid(pHandlerInput, speechOutput);

    return response.speak(speechOutput).reprompt(reprompt).getResponse();
}

function endSkill(pHandlerInput) {
    var speechOutput = "Thanks for checking out " + skillName + ". Learn more about " + categoryPlural + " another time. Goodbye!"

    const response = pHandlerInput.responseBuilder;

    response.withShouldEndSession(true);

    return response
        .speak(speechOutput)
        .getResponse();
}

function listTemplateMaker(pListTemplateType, pHandlerInput, pArray, pTitle, pOutputSpeech, pQuiz, pBackgroundIMG, pQuiz) {
    const response = pHandlerInput.responseBuilder;
    const backgroundImage = imageMaker("", pBackgroundIMG);
    var itemList = [];
    var title = pTitle;
    var listItemNames = [];
    
    if (pQuiz)
    {
        for (var i = 0; i < pArray.length; i++) {
            listItemNames[i] = "";
        }
    }
    else
    {
        for (var i = 0; i < pArray.length; i++) {
            listItemNames[i] = pArray[i].name;
        }
    }
    
    

    for (var i = 0; i < pArray.length; i++) {
        itemList.push({
            "token": pArray[i].token,
            "textContent": new Alexa.PlainTextContentHelper().withPrimaryText(capitalizeFirstLetter(listItemNames[i])).getTextContent(),
            "image": imageMaker("", pArray[i].imageURL)
        });
    }

    if (pOutputSpeech) {
        response.speak(pOutputSpeech);
    }

    response.addRenderTemplateDirective({
        type: pListTemplateType,
        backButton: 'hidden',
        backgroundImage,
        title,
        listItems: itemList,
    });

    return response.getResponse();
}

function bodyTemplateMaker(pBodyTemplateType, pHandlerInput, pImg, pTitle, pText1, pText2, pText3, pOutputSpeech, pReprompt, pHint, pBackgroundIMG, pEndSession) {
    const response = pHandlerInput.responseBuilder;
    const image = imageMaker("", pImg);
    const richText = richTextMaker(pText1, pText2, pText3);
    const backgroundImage = imageMaker("", pBackgroundIMG);
    const title = pTitle;

    response.addRenderTemplateDirective({
        type: pBodyTemplateType,
        backButton: 'visible',
        image,
        backgroundImage,
        title,
        textContent: richText,
    });

    if (pHint)
        response.addHintDirective(pHint);

    if (pOutputSpeech)
        response.speak(pOutputSpeech);

    if (pReprompt)
        response.reprompt(pReprompt)

    if (pEndSession)
        response.withShouldEndSession(pEndSession);

    return response.getResponse();
}

function showMainList(pHandlerInput) //For main list of values in the dictionary
{
    var speechOutput;
    const attributes = pHandlerInput.attributesManager.getSessionAttributes();
    const response = pHandlerInput.responseBuilder;

    resetAttributes(pHandlerInput);
    console.log(`Static HI in Show Main List:`);

    console.log(`HI in Show Main List: ${attributes.toString()}`);
    console.log(`HI in Show Main List: ${attributes}`);

    if (supportsDisplay(pHandlerInput) && !testingOnSim) {
        speechOutput = 'Select or ask for a ' + categorySingular + ' below for more information.';

        return listTemplateMaker('ListTemplate1', pHandlerInput, attributes.mainArray, speechOutput, speechOutput, null, mainImgBlurBG, false);
    } else {
        var objectArray = attributes.mainArray;

        speechOutput = "I have a range of " + categoryPlural + " I can tell you about including: ";

        for (let i = 0; i < objectArray.length; i++)
            speechOutput += objectArray[i].name + ', ';

        speechOutput += "which would you like to hear about?";

        saveLastThingSaid(pHandlerInput, speechOutput)

        return response.speak(speechOutput).reprompt(speechOutput).getResponse();
    }
}

function imageMaker(pDesc, pSource) {
    const myImage = new Alexa.ImageHelper()
        .withDescription(pDesc)
        .addImageInstance(pSource)
        .getImage();

    return myImage;
}

function supportsDisplay(handlerInput) {
    var hasDisplay =
        handlerInput.requestEnvelope.context &&
        handlerInput.requestEnvelope.context.System &&
        handlerInput.requestEnvelope.context.System.device &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
    return hasDisplay;
}

function resetAttributes(pHandlerInput) {
    const attributes = pHandlerInput.attributesManager.getSessionAttributes();
    attributes.skillState = null;
    attributes.selectedValueIndex = null;
    attributes.correctIndex = null;
    attributes.onScreenOptions = null;

    pHandlerInput.attributesManager.setSessionAttributes(attributes);
}

function saveLastThingSaid(pHandlerInput, pSpeechOutput) {
    const attributes = pHandlerInput.attributesManager.getSessionAttributes();
    attributes.lastOutputResponse = pSpeechOutput;
    pHandlerInput.attributesManager.setSessionAttributes(attributes);
}

function showSkillIntro(pSpeechOutput, pReprompt, pHandlerInput) {
    resetAttributes(pHandlerInput);

    var speechOutput = pSpeechOutput || '';
    var reprompt = pReprompt
    var cardTitle = skillName;

    speechOutput += 'Simply ask me to provide information about ' + categoryPlural + ' from the ' + skillDictionaryName + '.';

    if (supportsDisplay(pHandlerInput) && !testingOnSim) {

        //Selectable text
        var actionText1 = '<action value="dictionary_token"><i>' + skillDictionaryName + '</i></action>';

        saveLastThingSaid(pHandlerInput, speechOutput)

        var text = '<u><font size="7">' + skillName + '</font></u><br/><br/>Simply ask me to provide information about ' + categoryPlural + ' from the ' + actionText1 + '.';
        return bodyTemplateMaker('BodyTemplate3', pHandlerInput, mainImage, cardTitle, text, null, null, speechOutput, reprompt, null, mainImgBlurBG, false);
    } else {
        const response = pHandlerInput.responseBuilder;

        saveLastThingSaid(pHandlerInput, speechOutput)

        return response
            .speak(speechOutput)
            .reprompt(reprompt)
            .getResponse();
    }
}

function newSessionHandler(pHandlerInput) //Called every intent to handle modal/one shot utterances
{
    if (pHandlerInput.requestEnvelope.session.new) {
        var topicNames = [];

        for (let i = 0; i < Object.keys(topicData).length; i++)
            topicNames[i] = Object.keys(topicData)[i];

        var categoryArray = [];

        for (let i = 0; i < Object.keys(topicData).length; i++) {
            //We create a new set of the specified category values here
            categoryArray[i] = createArrayValue(topicNames[i], topicData[topicNames[i]].imgURL, topicData[topicNames[i]].info);
        }

        const attributes = pHandlerInput.attributesManager.getSessionAttributes();

        attributes.mainArray = shuffle(categoryArray);
        pHandlerInput.attributesManager.setSessionAttributes(attributes);
    }
}

function richTextMaker(pPrimaryText, pSecondaryText, pTertiaryText) {
    const myTextContent = new Alexa.RichTextContentHelper();

    if (pPrimaryText)
        myTextContent.withPrimaryText(pPrimaryText);

    if (pSecondaryText)
        myTextContent.withSecondaryText(pSecondaryText);

    if (pTertiaryText)
        myTextContent.withTertiaryText(pTertiaryText);

    return myTextContent.getTextContent();
}

function plainTextMaker(pPrimaryText, pSecondaryText, pTertiaryText) {
    const myTextContent = new Alexa.PlainTextContentHelper()
        .withPrimaryText(pPrimaryText)
        .withSecondaryText(pSecondaryText)
        .withTertiaryText(pTertiaryText)
        .getTextContent();

    return myTextContent;
}