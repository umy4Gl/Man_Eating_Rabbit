const acceptable_angles = [0, 45, 90, 135, 180, 225, 270, 315, 360];

function print(str) {
    if (typeof window === 'undefined') {
        console.log(str)
    } else {
        document.getElementById("output").appendChild(document.createTextNode(str));
    }
}

function println(str) {
    if (typeof window === 'undefined') {
        console.log(str)
    } else {
        document.getElementById("output").appendChild(document.createTextNode(str + '\n'));
    }
}


function input_from_web() {
    let input_element;
    let input_str;

    return new Promise(function (resolve) {
        input_element = document.createElement("INPUT");

        print("> ");
        input_element.setAttribute("type", "text");
        input_element.setAttribute("length", "50");
        document.getElementById("output").appendChild(input_element);
        input_element.focus();
        input_str = undefined;
        input_element.addEventListener("keydown", function (event) {
            if (event.keyCode == 13) {
                input_str = input_element.value;
                document.getElementById("output").removeChild(input_element);
                println(input_str);
                resolve(input_str);
            }
        });
    });
}

async function input_from_console() 
{
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    let answer = await new Promise(resolve => {
        rl.question("", resolve)
      })
    
    return answer;
}

async function input() {
    if (typeof window === 'undefined') {
        let res = await input_from_console();
        return res;
    } else {
        let res = await input_from_web();
        return res;
    }
}


function split_numbers(str) {
    let nums = str.split(' ');
    let n1 = parseInt(nums[0]);
    let n2 = parseInt(nums[1]);

    return [n1, n2];
}

function tab(space) {
    return " ".repeat(space);
}

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    print(tab(20) + "MAN-EATING RABBIT");
    print(tab(20) + "CREATIVE COMPUTING");
    print(tab(18) + "MORRISTOWN, NEW JERSEY");
    println("\n");
    println("\n");
    println("YOU ARE IN A PIT WITH A MAN-EATING RABBIT.");
    println("THE CENTER IS (0,0) AND IT HAS A RADIUS OF 10");
    println("IF YOU CAN AVOID THE RABBIT FOR 10 MOVES YOU WILL BE");
    println("RELEASED.  YOU AND THE RABBIT CAN MOVE ONLY 1 SPACE EACH");
    println("HOWEVER THE RABBIT CAN DO MULTIPLE JUMPS.");
    println("YOU CAN TRAVEL AT THESE ANGLES");
    println(acceptable_angles.join(','));


    let [x_r, y_r] = spawn_rabbit();
    while (check_object_in_pit(x_r, y_r) != true) {
        [x_r, y_r] = spawn_rabbit();
        check_object_in_pit(x_r, y_r);
    }

    println("INPUT 2 NUMBERS FROM 0 TO 10 WITH 1 SPACE")
    println("WHERE WOULD YOU LIKE TO BE DROPPED?")

    let userInput = await input();
    let [x, y] = split_numbers(userInput);


    while (check_object_in_pit(x, y) != true) {
        println('YOUR POSITION MUST BE IN PIT. PLEASE, INPUT 2 NUMBERS FROM 0 TO 10 WITH 1 SPACE');
        [x, y] = split_numbers(await input());
        check_object_in_pit(x, y);
    }

    if (x_r == x & y_r == y) {
        println('*****SQUISH*****');
        println('THE RABBIT IS DEAD! YOU ARE SET FREE!');
    }

    let distance = get_distance(x_r, y_r, x, y)
    println('RABBIT AT (' + x_r + '; ' + y_r + ') AND DISTANCE ' + distance);

    for (let step = 1; step <= 10; step++) {
        println("\n");
        println('TURN #' + step + ' HUMAN AT (' + x + '; ' + y + ')');

        [x, y] = await move_human(x, y);
        let death_from_rabbit = false;
        [death_from_rabbit, x_r, y_r] = move_rabbit_and_check_death(x, y, x_r, y_r);
        if (death_from_rabbit){
            return;
        }
    }

    println('YOU ARE RELEASED!');
}


function calculate_distance_and_check_death(x_r, y_r, x, y) {
    let distance = get_distance(x_r, y_r, x, y)
    println('RABBIT AT (' + x_r + '; ' + y_r + ') AND DISTANCE ' + distance);

    if (distance == 0) {
        println("**CRUNCH** WELL R.I.P.");
        return true;
    }

    return false;
}

async function move_human(x, y) {
    while (true) {
        let angle = await input_angle();
        let [new_x, new_y] = calcilate_new_position(x, y, angle);

        if (check_object_in_pit(new_x, new_y) == false) {
            println('YOU CAN MOVE ONLY INSIDE PIT');
        } else {
            println('MOVE TO (' + new_x + '; ' + new_y + ')');
            return [new_x, new_y];
        }
    }
}

async function input_angle() {
    while (true) {
        println('AT WHAT ANGLE WILL YOU RUN')
        println("YOU CAN TRAVEL AT THESE ANGLES");
        println(acceptable_angles.join(','));
        let angle = +(await input());
        if (acceptable_angles.includes(angle) == false) {
            println('INCORRECT ANGLE');
            println('PLEASE, INPUT ANGLE AGAIN');
        } else {
            return angle;
        }
    }
}


function move_rabbit_and_check_death(x, y, x_r, y_r) {
    let num = random(1, 2);
    
    for (let i = 0; i < num; i++) {       
        [x_r, y_r] = move_rabbit(x, y, x_r, y_r);

        if (calculate_distance_and_check_death(x_r, y_r, x, y)) {
            return [true, x_r, y_r];
        }
    }

    return [false, x_r, y_r];
}

function move_rabbit(x, y, x_r, y_r) {
    let best_angle = get_rabbit_best_angle(x, y, x_r, y_r);
    var moving_angles = get_rabbit_moving_angles(best_angle);

    for (let possible_angle of moving_angles) {
        let [new_x, new_y] = calcilate_new_position(x_r, y_r, possible_angle);
        if (check_object_in_pit(new_x, new_y)) {
            return [new_x, new_y];
        }
    }

    return [x_r, y_r];
}

function get_rabbit_best_angle(x, y, x_r, y_r) {
    let dist = get_distance(x, y, x_r, y_r);
    let side = Math.abs(y - y_r);

    let radians = Math.asin(side / dist)
    if ((x < x_r && y >= y_r) || (x >= x_r && y < y_r))
        radians = Math.acos(side / dist)

    let degrees = 180 * radians / Math.PI

    if (x < x_r && y >= y_r)
        degrees += 90;
    if (x < x_r && y < y_r)
        degrees += 180;
    if (x >= x_r && y < y_r)
        degrees += 270;

    return degrees
}

function get_rabbit_moving_angles(best_angle) {
    let moving_angles = {};
    for (let ang of acceptable_angles) {
        let diff = Math.abs(best_angle - ang);
        moving_angles[ang] = diff;
    }

    moving_angles = sort_angles_dictionary(moving_angles)
    return moving_angles;
}

function sort_angles_dictionary(dict) {
    let items = Object.keys(dict).map(function (key) {
        return [key, dict[key]];
    });

    items.sort(function (first, second) {
        return first[1] - second[1];
    });

    let result = [];
    for (let item of items) {
        result.push(item[0]);
    }

    return result;
}



function calcilate_new_position(x, y, angle) {
    let m = 1;

    if (angle % 10 == 5) {
        m = Math.sqrt(2)
    }

    let move_x = m * Math.cos(angle * (Math.PI / 180))
    let move_y = m * Math.sin(angle * (Math.PI / 180))

    let new_x = x + Math.round(move_x)
    let new_y = y + Math.round(move_y)

    return [new_x, new_y];
}

function check_object_in_pit(x, y) {
    if (x ** 2 + y ** 2 <= 100)
        return true;
    else
        return false;
}

function spawn_rabbit() {
    let x_r = random(-10, 10);
    let y_r = random(-10, 10);

    return [x_r, y_r];
}

function get_distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}


main();
