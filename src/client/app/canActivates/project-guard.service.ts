/**
 * ProjectGuardService
 */
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Functions } from '..';
import { CinerinoService } from '../services';

@Injectable({
    providedIn: 'root'
})
export class ProjectGuardService implements CanActivate {

    constructor(
        private cinerino: CinerinoService
    ) { }

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        try {
            await this.cinerino.getServices();
            const projects = (await this.cinerino.project.search({})).data;
            if (projects.find(p => p.id === Functions.Util.getProject().projectId) === undefined) {
                throw new Error('project not found');
            }

            return true;
        } catch (error) {
            location.href = '/404.html';
            return false;
        }
    }
}
