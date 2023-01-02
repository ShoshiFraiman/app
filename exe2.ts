import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Stats } from 'fs';
export enum STATE {
    UP = 0,
    DOWN,
    STOP
};

@Component({
    selector: 'app-elevantor',
    template: `
    <input #thisFloor>
    <button (click)="EnignePressedFloor(thisFloor.thisFloor.value,0)"}>0 </button>
    <button (click)="EnignePressedFloor(thisFloor.1)}">1 </button>
    <button (click)="EnignePressedFloor(thisFloor.2)"}>2 </button>
    <button (click)="EnignePressedFloor(thisFloor.3)"}>3 </button>
    <button (click)="EnignePressedFloor(thisFloor.4)"}>4 </button>
    <button (click)="EnignePressedFloor(thisFloor.5)"}>5 </button>
    <button (click)="EnignePressedFloor(thisFloor.6)"}>6 </button>
    <button (click)="EnignePressedFloor(thisFloor.7)"}>7 </button>
    <button (click)="EnignePressedFloor(thisFloor.8)"}>8 </button>
    `})
export class ElevantorComponent implements OnInit {

    constructor(private http: HttpClient, private _router: Router) {
    }
    //#IDEA 
    // An array of pairs of floor where you want to go up and floor where you want to go down
    // and an array of floors where the elevator should stop
    // Every floor the elevator passes through it checks if someone wants to go up there, if so it stops and enters the floor where the waiting person wants to go down into the array of floors where the elevator should stop
    // Each waiting person who presses a button enters the array of pairs of the floor he is on and the floor he wants to get off, he waits until the elevator reaches his floor.
    //
    // The array of stopping stations will be arranged according to the order of requests
    // There will be a function that will constantly run on the above array
    // And every time the elevator passes a floor it will look to see if anyone wants to get off that floor, if so it will stop
    //#endregion
    currentFloor: number = 0
    waiting!: { floorToEnterElevantor: number, deestFloor: number }[];
    stoppingStations!: number[]
    state: STATE = STATE.STOP;
    ngOnInit() {
        this.moveThestoppingStations();
    }

    moveThestoppingStations() {
        while (0) {
            this.stoppingStations.forEach(stopStation => {
                if (this.currentFloor > stopStation) {
                    this.EngineDown(stopStation);
                }
                else {
                    this.EngineUp(stopStation)
                }
            })
        }
    }
    EnignePressedFloor(currentFloor: number, destFloor: number) {
        this.waiting.push({ floorToEnterElevantor: currentFloor, deestFloor: destFloor });
    }


    EngineUp(destFloor: number) {
        while (this.EngineGetCurrFloor() > destFloor) {
            this.currentFloor++;
            this.state = STATE.UP;
            this.cheackSomethingIsWaiting();
            this.cheackAnythingShouldComeDown();
        }
    }


    EngineDown(destFloor: number) {
        while (this.EngineGetCurrFloor() > destFloor) {
            this.currentFloor--;
            this.state = STATE.DOWN;
            this.cheackSomethingIsWaiting();
            this.cheackAnythingShouldComeDown();

        }
    }
    cheackSomethingIsWaiting() {
        this.waiting.forEach(val => {
            if (val.floorToEnterElevantor == this.currentFloor) {
                this.EngineStop();
                this.stoppingStations.push(val.deestFloor)
                //and remove this pair
            }
        })
    }
    cheackAnythingShouldComeDown() {
        this.stoppingStations.forEach(floor => {
            if (floor == this.EngineGetCurrFloor()) {
                this.EngineStop();
                this.stoppingStations = this.stoppingStations.filter(floor => { floor != this.EngineGetCurrFloor() })
            }
        })
    }
    EngineStop() {
        this.state = STATE.STOP;
        console.log("The Elevatoe Was Stoped");

    }
    EngineStateGet() {
        return this.state.valueOf();
    }

    EngineGetCurrFloor(): number {
        return this.currentFloor;
    }

}
