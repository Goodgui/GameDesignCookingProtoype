Cooking System Game Design:
Goals:
- Intuitive for new players
- Simple enough that it is not annoying
- Interesting/Fun enough that it's not a chore
- Meaningful to gameplay, but not critical aside from basic survival mechanics
- Ability for players to experiment
- Semi-Realistic. So things carrot + onion + flour are not a good combination

Basic Mechanics:
food items will fall into one of these categories:
Base ingredient: Ingredients that are foraged, or come into Gensokyo from the real world and are not able to be crafted
main ingredient: An ingredient that is crafted from base ingredients
meal: A final result made from ingredients that cannot be processed further

Each food item will consist of the following values that can range from 0 to 10:
Values are averaged as ingredients are combined.

**Taste values:**
1. sweet 	    0-10
2. sour	        0-10
3. salty	    0-10
4. bitter	    0-10
5. umami	    0-10
6. spicy	    0-10
7. Toughness	0-10 (Tough/Tender/Gooey)
8. Dryness		0-10 (Dry/Moist/Watery)
9. Chewiness	0-10 (Chewy/Creamy/Crunchy)

**Health values:**
Protein         0-10
Carbohydrates   0-10
Fats            0-10
Vitamins        0-10
Minerals        0-10

**Other values:**
Caffeine        0-10
Alcohol         0-10
Calories        0-10


**Main values:**
Tasty - How many taste values are balanced
0 - Awful 
1 - Okay   
2 - Good     
3 - Delicious
4 - Perfect
5 - Perfect
6 - Delicious
7 - Good
8 - Okay
9 - Awful

Healthy - How many health values are balanced
0 - Unhealthy
1 - Okay
2 - Good
3 - Healthy
4 - Very Healthy
5 - Perfect

Hearty (How many calories it has)
0 - 10 calories


Ingredient mixes:
mushroom
berry
herb
nut
meat
fruit
root
egg
grain
leaf
liquid

T2 ingredients
Flour


T3 ingredients
Dough


grain + grain + grain = flour | name = grain:name if all 3 flours are the same otherwise "Mixed Flour"
egg + egg + egg = scrambled eggs
egg + flour + water = "<flour type> Dough"
<fruit/berry/leaf> + <fruit/berry/leaf> + <any> = "<A + B + C> Salad"
Dough + <fruit/berry/root/nut> + <fruit/berry/root/nut> = "<B + C> Pie"
