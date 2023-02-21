# Brainstorming

## Part 1
- After observing the crash, I resulted to reading logs from the streaming service to find that it was trying to parse invalid JSON.

    This was resolved by adding a try catch to see if the incoming data is capable of being parsed and if not, we ignore and move on to prevent the server from crashing

## Part 2
- In order to know when the battery exceeds the safe operating temperature range multiple times in a given time period, we must first capture every instance this condition is breached. I have approached this by using an array to hold the times atr which the battery exceeds the safe range.

    From here, we simply filter out any occurences where the timestamp is greater than 5 seconds ago (as outlined in the spec), leaving behind the number of occurrences that are within the previous 5 seconds. If the array size is greater than 3, we know that we've hit our logging condition and thus we log to `incidents.log`

## Part 3
- Based on the incoming temperature, we assign a colour based on the value.

    | Range                           | Colour |
    |---------------------------------|--------|
    | Safe (20-80)                    | Green  |
    | Nearing unsafe (20-25 or 75-80) | Yellow |
    | Unsafe (<20 or >80)             | Red    |

- Didn't see any asthetic changes applicable to the frontend. Functionally, the temperature could be represented with a gauge/meter, however, I believe this is out of the scope of this assessment.

## Part 4 
- The linting and unit testing aspect was quite straight forward, using a basic eslint config, we enforce style on the given codebase. `npm run lint` is then added to the workflow file to ensure the pipeline proceeds with linting checks.

- Likewise, we're using Jest for unit testing. For the time being, the tests aren't important (as mentioned by Anjie) so I placed a simple example test in all components of the system. `npm t` was added to the workflow file.

- Docker was a new experience for me. it was something I had been meaning to learn and I am glad this assessment gave me the drive to do so. 

    Following the provided resources, I created a dockerfile to "shape" the container that these processes will live in.

    From here, I added an action in the workflow to push these build images to Docker Hub using personal access tokens/repository secrets where necessary.